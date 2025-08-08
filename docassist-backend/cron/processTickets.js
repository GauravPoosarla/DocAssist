const fs = require('fs');
const path = require('path');
const { classifyTicket } = require('../services/llmService');
const Ticket = require("../models/ticketModel");

const filePath = path.join(__dirname, '../data/tickets.json');

async function processPendingTickets() {
  let tickets = [];

  try {
    // const file = fs.readFileSync(filePath, 'utf8');
    // tickets = JSON.parse(file);
    tickets = await Ticket.find({status: "pending"});
  } catch (err) {
    console.error("Failed to read tickets:", err);
    return;
  }

  let updated = false;

  for (let ticket of tickets) {
    if (ticket.status === 'pending') {
      try {
        await Ticket.findByIdAndDelete(ticket._id);
        const ai = await classifyTicket(ticket);
        ticket.ai = ai;
        ticket.status = 'processed';
        updated = true;
        console.log(`🤖 Processed ticket ${ticket.id}`);
      } catch (err) {
        console.error(`Failed to classify ticket ${ticket.id}`, err);
      }
    }
  }

  if (updated) {
    // fs.writeFileSync(filePath, JSON.stringify(tickets, null, 2));
    await Ticket.create(tickets);
  }
}

module.exports = {processPendingTickets};