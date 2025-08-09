const axios = require("axios");

const { generateUpdatedConfluenceHtml } = require("./llmService");

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

  const updatedHtmlWithHighlights = await generateUpdatedConfluenceHtml(
    currentContent,
    ticket,
    attachmentsHtml
  );

  const timestamp = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

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
