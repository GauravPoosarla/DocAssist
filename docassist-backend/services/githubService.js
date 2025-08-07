const axios = require("axios");
async function fetchIssues(repo = "vercel/next.js", token = null) {
  const url = `https://api.github.com/repos/${repo}/issues?state=open&per_page=10`;

  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const res = await axios.get(url, { headers });

  const tickets = res.data
    .filter(issue => !issue.pull_request)
    .map(issue => ({
      id: `GH-${issue.number}`,
      title: issue.title,
      description: issue.body || "",
      status: "pending"
    }));

  return tickets;
}

module.exports = { fetchIssues };