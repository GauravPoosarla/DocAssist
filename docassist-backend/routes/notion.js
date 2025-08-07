const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  searchRelevantPage,
  appendDocSuggestion
} = require('../services/notionService');

const router = express.Router();
const filePath = path.join(__dirname, '../data/tickets.json');

router.post('/update/:id', async (req, res) => {
  const { id } = req.params;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const ticket = data.find(t => t.id === id);

  if (!ticket || ticket.status !== 'processed' || !ticket.ai) {
    return res.status(400).json({ error: "Invalid or unprocessed ticket." });
  }

  const { keywords, doc_suggestion } = ticket.ai;

  const page = await searchRelevantPage(keywords);

  if (!page) {
    return res.status(404).json({ error: "No relevant Notion page found." });
  }

  await appendDocSuggestion(page.id, doc_suggestion);

  res.json({ message: "Notion doc updated successfully.", pageUrl: page.url });
});

module.exports = router;
