const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../data/tickets.json');

router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const tickets = JSON.parse(data);
    res.json(tickets);
  } catch (err) {
    console.error("Failed to read tickets.json", err);
    res.status(500).json({ error: "Unable to read tickets." });
  }
});

module.exports = router;
