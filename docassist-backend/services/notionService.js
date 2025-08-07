const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function searchRelevantPage(keywords) {
  try {
    const query = keywords.join(" ");
    const response = await notion.search({
      query,
      sort: { direction: 'descending', timestamp: 'last_edited_time' }
    });

    return response.results.find(page => page.object === 'page');
  } catch (err) {
    console.error("🔍 Notion search error:", err.message);
    return null;
  }
}

async function appendDocSuggestion(pageId, suggestion) {
  try {
    await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: { content: `📝 ${suggestion}` }
              }
            ]
          }
        }
      ]
    });

    console.log(`Appended suggestion to Notion page ${pageId}`);
  } catch (err) {
    console.error("Failed to update Notion doc:", err.message);
  }
}

module.exports = {
  searchRelevantPage,
  appendDocSuggestion
};
