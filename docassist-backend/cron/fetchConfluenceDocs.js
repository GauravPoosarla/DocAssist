const fs = require("fs");
const path = require("path");
const { fetchConfluencePages } = require("../services/confluenceService");
const { summarizeConfluenceDoc } = require("../services/llmService");

const config = {
  domain: process.env.CONFLUENCE_DOMAIN,
  email: process.env.CONFLUENCE_EMAIL,
  apiToken: process.env.CONFLUENCE_API_TOKEN,
  spaceKey: process.env.CONFLUENCE_SPACE_KEY
};

const DOCS_PATH = path.join(__dirname, "../data/confluence_docs.json");

function loadDocs() {
  if (!fs.existsSync(DOCS_PATH)) return [];
  return JSON.parse(fs.readFileSync(DOCS_PATH, "utf-8"));
}

function saveDocs(docs) {
  fs.writeFileSync(DOCS_PATH, JSON.stringify(docs, null, 2));
}

async function fetchAndStoreConfluenceDocs() {
  try {
    const pages = await fetchConfluencePages(config);

    const existing = loadDocs();
    const existingIds = new Set(existing.map(d => d.id));

    const processedDocs = [...existing];

    for (const page of pages) {
      if (!existingIds.has(page.id)) {
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

    saveDocs(processedDocs);

    console.log(`Total docs stored: ${processedDocs.length}`);
  } catch (err) {
    console.error("Error fetching/summarizing Confluence docs:", err.message);
  }
}

module.exports = { fetchAndStoreConfluenceDocs };
