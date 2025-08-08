const axios = require("axios");

async function fetchJiraTickets({ domain, email, apiToken, projectKey }) {
  const url = `https://${domain}.atlassian.net/rest/api/3/search?jql=project=${projectKey}&fields=summary,description,attachment`;
  const auth = Buffer.from(`${email}:${apiToken}`).toString("base64");

  const res = await axios.get(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json"
    }
  });

  function extractDescriptionText(content) {
    if (!content) return "No description";
    return content.reduce((text, item) => {
      if (item.type === "text") {
        return text + item.text;
      }
      if (item.content) {
        return text + extractDescriptionText(item.content);
      }
      return text;
    }, "");
  }

  const tickets = res.data.issues.map(issue => {
    const description = issue.fields.description
      ? extractDescriptionText(issue.fields.description.content)
      : "No description";

    const attachments = issue.fields.attachment?.map(file => ({
      id: file.id,
      filename: file.filename,
      mimeType: file.mimeType,
      contentUrl: file.content
    })) || [];

    return {
      id: issue.key,
      title: issue.fields.summary,
      description,
      status: "pending",
      attachments
    };
  });

  return tickets;
}

module.exports = { fetchJiraTickets };
