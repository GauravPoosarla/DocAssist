const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/tickets.json');

function generateDummyTicket() {
  const timestamp = Date.now();
  const randomTitles = [
    "Add estimated delivery date to confirmation page",
    "Fix null pointer exception in cart module",
    "Enable discount coupon in checkout",
    "Resolve crash on product detail load",
    "Add phone number validation on registration"
  ];

  const descriptions = {
    "Add estimated delivery date to confirmation page":
      "Customers couldn’t see expected delivery date. Now added ETA from ShippingService.",
    "Fix null pointer exception in cart module":
      "App was crashing due to null product reference in CartService.",
    "Enable discount coupon in checkout":
      "Added support for applying discount coupons during checkout.",
    "Resolve crash on product detail load":
      "Crash caused by missing image asset on some products.",
    "Add phone number validation on registration":
      "Implemented front-end validation for phone numbers during signup."
  };

  const title = randomTitles[Math.floor(Math.random() * randomTitles.length)];

  return {
    id: `TKT-${timestamp}`,
    title,
    description: descriptions[title],
    status: "pending"
  };
}

function fetchDummyTickets() {
  let tickets = [];

  try {
    const file = fs.readFileSync(filePath, 'utf8');
    tickets = JSON.parse(file);
  } catch (err) {
    console.warn("tickets.json not found or empty, starting fresh.");
  }

  const newTicket = generateDummyTicket();
  tickets.push(newTicket);

  fs.writeFileSync(filePath, JSON.stringify(tickets, null, 2));
  console.log(`New ticket added: ${newTicket.id}`);
}

module.exports = fetchDummyTickets;
