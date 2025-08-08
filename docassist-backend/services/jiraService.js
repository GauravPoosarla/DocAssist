const axios = require("axios");

async function fetchJiraTickets({ domain, email, apiToken, projectKey }) {
  const url = `https://${domain}.atlassian.net/rest/api/3/search?jql=project=${projectKey}&fields=summary,description,attachment,comment,status`;
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

  const tickets = await Promise.all(res.data.issues.map(async issue => {
    const description = issue.fields.description
      ? extractDescriptionText(issue.fields.description.content)
      : "No description";

    const attachments = issue.fields.attachment?.map(file => ({
      id: file.id,
      filename: file.filename,
      mimeType: file.mimeType,
      contentUrl: file.content
    })) || [];

    const comments = issue.fields.comment?.comments?.map(comment => ({
      id: comment.id,
      author: comment.author.displayName,
      body: comment.body.content
        .map(c => c.content?.map(inner => inner.text).join(" ") || "")
        .join(" "),
      created: comment.created
    })) || [];

    const issueTypeUrl = `https://${domain}.atlassian.net/rest/api/3/issue/${issue.key}?fields=issuetype`;
    const issueTypeRes = await axios.get(issueTypeUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json"
      }
    });

    return {
      id: issue.key,
      title: issue.fields.summary,
      description,
      comments,
      attachments,
      status: "pending",
      jira_status: issue.fields.status?.name,
      type: issueTypeRes.data.fields.issuetype.name,
    };
  }));

  return tickets;
}

module.exports = { fetchJiraTickets };
