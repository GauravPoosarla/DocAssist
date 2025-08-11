const fs = require("fs");
const path = require("path");
const Document = require("../models/documentModel");
const { fetchConfluencePages } = require("../services/confluenceService");
const { summarizeConfluenceDoc } = require("../services/llmService");

const config = {
  domain: process.env.CONFLUENCE_DOMAIN,
  email: process.env.CONFLUENCE_EMAIL,
  apiToken: process.env.CONFLUENCE_API_TOKEN,
  spaceKey: process.env.CONFLUENCE_SPACE_KEY
};

async function fetchAndStoreConfluenceDocs() {
  try {
    const pages = await fetchConfluencePages(config);
    const existing = await Document.find();
    const existingIds = new Set(existing.map(d => d.id));

    const processedDocs = [...existing];

    for (const page of pages) {
      if (!existingIds.has(page.id) && page.id !== "1605654") {
        console.log(`Summarizing new doc: ${page.title}`);
        const summaryData = await summarizeConfluenceDoc(page);

        processedDocs.push({
          id: page.id,
          title: summaryData.title || page.title,
          summary: summaryData.summary || "",
          link: page.link
        });
      }
    }
    
    await Document.create(processedDocs);

    console.log(`Total docs stored: ${processedDocs.length}`);
  } catch (err) {
    console.error("Error fetching/summarizing Confluence docs:", err.message);
    throw err;
  }
}

module.exports = { fetchAndStoreConfluenceDocs };
