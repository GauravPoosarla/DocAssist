const fs = require("fs");
const path = require("path");
const { fetchIssues } = require("../services/githubService");

const TICKETS_PATH = path.join(__dirname, "../data/tickets.json");

function loadTickets() {
  if (!fs.existsSync(TICKETS_PATH)) return [];
  return JSON.parse(fs.readFileSync(TICKETS_PATH, "utf-8"));
}

function saveTickets(tickets) {
  fs.writeFileSync(TICKETS_PATH, JSON.stringify(tickets, null, 2));
}

async function run() {
  console.log("Fetching GitHub issues...");
  const githubTickets = await fetchIssues("vercel/next.js");

  const existingTickets = loadTickets();
  const existingIds = new Set(existingTickets.map(t => t.id));

  const newTickets = githubTickets.filter(t => !existingIds.has(t.id));

  if (newTickets.length > 0) {
    console.log(`Fetched ${newTickets.length} new ticket(s)`);
    const updated = [...existingTickets, ...newTickets];
    saveTickets(updated);
  } else {
    console.log("No new tickets found.");
  }
}

if (require.main === module) {
  run().catch(err => {
    console.error("Failed to fetch tickets:", err.message);
  });
}
