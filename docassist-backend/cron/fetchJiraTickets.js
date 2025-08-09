const { fetchJiraTickets } = require("../services/jiraService");
const fs = require("fs");
const path = require("path");
const Ticket = require("../models/ticketModel");

const config = {
  domain: process.env.JIRA_DOMAIN,
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  projectKey: process.env.JIRA_PROJECT_KEY || "DOCASSIST",
};

// const TICKETS_PATH = path.join(__dirname, "../data/tickets.json");

/* function loadTickets() {
  if (!fs.existsSync(TICKETS_PATH)) return [];
  return JSON.parse(fs.readFileSync(TICKETS_PATH, "utf-8"));
} */

async function saveTickets(tickets) {
  // fs.writeFileSync(TICKETS_PATH, JSON.stringify(tickets, null, 2));
  await Ticket.create(tickets);
}

async function fetchAndStoreJiraTickets() {

  const jiraTickets = await fetchJiraTickets(config);

  // const existing = loadTickets();
  const existing = await Ticket.find();
  const existingIds = new Set(existing.map(t => t.id));

  const newOnes = jiraTickets.filter(t => !existingIds.has(t.id) && t.jira_status === 'Done' && t.type === 'Story');
  if (newOnes.length) {
    console.log(`Found ${newOnes.length} new tickets`);
    saveTickets([...newOnes]);
  } else {
    console.log("No new tickets found.");
  }

  return newOnes;
}

module.exports = { fetchAndStoreJiraTickets };
