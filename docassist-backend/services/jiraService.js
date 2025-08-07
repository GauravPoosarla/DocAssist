const axios = require("axios");

async function fetchJiraTickets({ domain, email, apiToken, projectKey }) {
  const url = `https://${domain}.atlassian.net/rest/api/3/search?jql=project=${projectKey}`;
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

const tickets = res.data.issues.map(issue => ({
    id: issue.key,
    title: issue.fields.summary,
    description: issue.fields.description ? extractDescriptionText(issue.fields.description.content) : "No description",
    status: "pending"
  }));

  return tickets;
}

module.exports = { fetchJiraTickets };
