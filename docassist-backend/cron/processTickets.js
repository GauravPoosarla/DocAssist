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

  for (let ticket of tickets) {
    if (ticket.status === 'pending') {
      try {
        const ai = await classifyTicket(ticket);
        ticket.status = 'processed';
        console.log(`🤖 Processed ticket ${ticket.id}`);
        console.log(ticket);
        await Ticket.findByIdAndUpdate({_id: ticket._id}, { $set: { ai, status: ticket.status} }, { new: true });
      } catch (err) {
        console.error(`Failed to classify ticket ${ticket.id}`, err);
      }
    }
  }

  return tickets;
}

module.exports = {processPendingTickets};