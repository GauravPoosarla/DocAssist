const axios = require("axios");

async function fetchConfluencePages({ domain, email, apiToken, spaceKey }) {
  const auth = Buffer.from(`${email}:${apiToken}`).toString("base64");

  const url = `https://${domain}.atlassian.net/wiki/rest/api/content?spaceKey=${spaceKey}&limit=100&expand=body.storage,version`;

  const res = await axios.get(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json"
    }
  });

  const pages = res.data.results.map(page => ({
    id: page.id,
    title: page.title,
    version: page.version.number,
    content: page.body?.storage?.value || "",
    link: `https://${domain}.atlassian.net/wiki/spaces/${spaceKey}/pages/${page.id}`
  }));

  return pages;
}

async function updateConfluencePageWithTicket(config, pageId, ticket) {
  const auth = Buffer.from(`${config.email}:${config.apiToken}`).toString("base64");

  const getUrl = `https://${config.domain}.atlassian.net/wiki/rest/api/content/${pageId}?expand=body.storage,version`;
  const res = await axios.get(getUrl, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json"
    }
  });

  const page = res.data;
  const currentVersion = page.version.number;
  const currentContent = page.body.storage.value;

  // Prepare attachment HTML
  let attachmentsHtml = "";
  if (ticket.attachments && ticket.attachments.length > 0) {
    attachmentsHtml += `<h4>Attachments</h4>`;
    ticket.attachments.forEach(att => {
      if (att.mimeType?.startsWith("image")) {
        attachmentsHtml += `
          <p><b>${att.filename}</b></p>
          <ac:image>
            <ri:url ri:value="${att.contentUrl}" />
          </ac:image>
        `;
      } else {
        attachmentsHtml += `
          <p><b>${att.filename}</b> — <a href="${att.contentUrl}">Download</a></p>
        `;
      }
    });
  }

  const timestamp = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  const llmPrompt = `
You are an assistant that updates Confluence documentation.

Given the current HTML content of a page and a Jira ticket, 
return ONLY the updated HTML where:
1. Relevant changes from the ticket are highlighted (<span style="background-color: yellow">...</span>).
2. The rest of the document is unchanged.
3. Do NOT remove any unrelated content.
4. Strikethrough the old values.

Current HTML:
${currentContent}

Ticket ID: ${ticket.id}
Title: ${ticket.title}
Description: ${ticket.description}
${attachmentsHtml ? `Attachments: ${attachmentsHtml}` : ""}
`;

  let updatedHtmlWithHighlights = currentContent;
  try {
    const llmRes = await axios.post(
      process.env.SAMSUNG_LLM_API_URL,
      {
        model: "latest",
        messages: [
          { role: "system", content: "You are a helpful documentation assistant." },
          { role: "user", content: llmPrompt }
        ],
        stream: false,
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SAMSUNG_LLM_API_KEY}`,
          "X-Project-ID": "94c72648-7b4d-4f7b-a971-190738f15544",
          "X-User-ID": `${process.env.SAMSUNG_LLM_USER_ID}`
        }
      }
    );

    const llmOutput = llmRes.data.choices[0]?.message?.content?.trim();
    if (llmOutput && llmOutput.length > 0) {
      updatedHtmlWithHighlights = llmOutput.replace(/^```html\s*|\s*```$/g, "");
    } else {
      console.warn("LLM returned empty content — keeping original HTML.");
    }
  } catch (err) {
    console.error("Failed to get updated HTML from LLM:", err.message);
    console.warn("Falling back to original HTML content.");
  }

  const finalUpdatedContent = `
    ${updatedHtmlWithHighlights}
    <hr/>
    <h3>Docassist updated relevant tickets</h3>
    <p><b>Updated On:</b> ${timestamp}</p>
    <p><b>Ticket:</b> ${ticket.id}</p>
    <p><b>Title:</b> ${ticket.title}</p>
    <p><b>Description:</b> ${ticket.description}</p>
    ${attachmentsHtml}
  `;

  const putUrl = `https://${config.domain}.atlassian.net/wiki/rest/api/content/${pageId}`;
  await axios.put(
    putUrl,
    {
      id: pageId,
      type: "page",
      title: page.title,
      body: {
        storage: {
          value: finalUpdatedContent,
          representation: "storage"
        }
      },
      version: {
        number: currentVersion + 1
      }
    },
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
      }
    }
  );

  console.log(`Updated Confluence page ${pageId} with highlighted changes for ticket ${ticket.id}`);
}

module.exports = { fetchConfluencePages, updateConfluencePageWithTicket };
