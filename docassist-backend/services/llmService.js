const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
const Document = require("../models/documentModel");
require("dotenv").config();

async function fetchTextAttachmentContent(contentUrl, auth) {
  try {
    const res = await axios.get(contentUrl, {
      headers: {
        Authorization: `Basic ${auth}`
      },
      responseType: "text"
    });
    return res.data.slice(0, 1000);
  } catch (err) {
    console.warn("Failed to fetch text attachment:", err.message);
    return null;
  }
}

async function fetchAndExtractTextFromImage(contentUrl, auth, filename) {
  try {
    const imagePath = path.join(__dirname, "tmp", filename);
    const res = await axios.get(contentUrl, {
      headers: {
        Authorization: `Basic ${auth}`
      },
      responseType: "arraybuffer"
    });
    fs.mkdirSync(path.join(__dirname, "tmp"), { recursive: true });
    fs.writeFileSync(imagePath, res.data);

    const result = await Tesseract.recognize(imagePath, "eng");
    fs.unlinkSync(imagePath);
    return result.data.text.trim().slice(0, 1000);
  } catch (err) {
    console.warn("OCR failed for image:", err.message);
    return null;
  }
}

async function classifyTicket(ticket) {
  const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString("base64");

  let attachmentText = "";

  for (const att of ticket.attachments || []) {
    if (att.mimeType.startsWith("text")) {
      const content = await fetchTextAttachmentContent(att.contentUrl, auth);
      if (content) {
        attachmentText += `\n\n[Attachment: ${att.filename}]\n${content}`;
      }
    } else if (att.mimeType.startsWith("image")) {
      const text = await fetchAndExtractTextFromImage(att.contentUrl, auth, att.filename);
      if (text) {
        attachmentText += `\n\n[Image Attachment OCR: ${att.filename}]\n${text}`;
      }
    }
  }

  const prompt = `
You are an AI documentation assistant.

Given a support ticket title and description, do the following:
1. Classify the ticket as either "Bug" or "Enhancement".
2. Summarize what product behavior has changed.
3. Suggest 2–3 keywords to locate the relevant doc.
4. Where in the system, assuming the system is e-commerce and what service like fulfillment, orders, catalog, sso, pricing etc. is impacted? and is it temporary or permanent?

Return a JSON object like this:
{
  "type": "Bug | Enhancement",
  "summary": "Concise description of change",
  "doc_suggestion": "Where in docs to update",
  "keywords": ["word1", "word2"],
  "service": "service_name",
  "impact_location": "location_in_system",
  "is_permanent": "temporary_or_permanent"
}

Ticket Title: ${ticket.title}
Ticket Description: ${ticket.description}
Ticket Comments: ${ticket.comments.map(c => c.body).join("\n") || "No comments"}
${attachmentText ? `Additional Content from Attachments:\n${attachmentText}` : ""}
`;

  try {
    const response = await axios.post(
      process.env.SAMSUNG_LLM_API_URL,
      {
        model: "latest",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: prompt }
        ],
        stream: false,
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SAMSUNG_LLM_API_KEY}`,
          "X-Project-ID": "94c72648-7b4d-4f7b-a971-190738f15544",
          "X-User-ID": `${process.env.SAMSUNG_LLM_USER_ID}`
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    if (!aiResponse) throw new Error("No response from LLM");

    let cleanedResponse = aiResponse.trim().replace(/^```json\s*|\s*```$/g, '');
    return JSON.parse(cleanedResponse);

  } catch (err) {
    console.error("LLM error:", err.message);
    throw err;
  }


}

async function summarizeConfluenceDoc(doc) {
  const prompt = `
You are an AI documentation assistant.

Given the following Confluence document content, return a JSON object with:
{
  "summary": "8-10 lines summarizing the main points of the document"
}

Document Content:
${doc.content}
`;

  try {
    const response = await axios.post(
      process.env.SAMSUNG_LLM_API_URL,
      {
        model: "latest",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: prompt }
        ],
        stream: false,
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SAMSUNG_LLM_API_KEY}`,
          "X-Project-ID": "94c72648-7b4d-4f7b-a971-190738f15544",
          "X-User-ID": `${process.env.SAMSUNG_LLM_USER_ID}`
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    if (!aiResponse) throw new Error("No response from LLM");

    let cleaned = aiResponse.trim().replace(/^```json\s*|\s*```$/g, '');
    return JSON.parse(cleaned);

  } catch (err) {
    console.error("LLM summarization error:", err.message);
    throw err;
  }
}

async function findRelevantDocsForTicket(ticket) {
  const docs = await Document.find();
  const docsList = docs.map((doc, i) => 
    `${i+1}. ID: ${doc.id}, Title: "${doc.title}", Summary: "${doc.summary}", Link: "${doc.link}"`
  ).join("\n");

  const prompt = `
We have the following Jira ticket:
Title: ${ticket.title}
Description: ${ticket.description}

Attachments / Additional Content:
${ticket.attachmentsText || "None"}

We have these Confluence documents:
${docsList}

Please identify the 3 most relevant documents to this ticket and return JSON like:
{
  "top_docs": [
    { "id": "doc_id", "title": "doc_title", "link": "doc_link" }
  ]
}
`;

  const response = await axios.post(
    process.env.SAMSUNG_LLM_API_URL,
    {
      model: "latest",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: prompt }
      ],
      stream: false,
      temperature: 0
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.SAMSUNG_LLM_API_KEY}`,
        "X-Project-ID": "94c72648-7b4d-4f7b-a971-190738f15544",
        "X-User-ID": process.env.SAMSUNG_LLM_USER_ID
      }
    }
  );

  let cleaned = response.data.choices[0].message.content.trim().replace(/^```json\s*|\s*```$/g, "");
  return JSON.parse(cleaned);
}

async function generateUpdatedConfluenceHtml(currentContent, ticket, attachmentsHtml, pageId) {
let prompt = `
    You are an assistant that updates Confluence documentation.
    
    Given the current HTML content of a page and a Jira ticket, 
    return ONLY the updated HTML where:
    1. Relevant changes from the ticket are highlighted using <span style="background-color: yellow">...</span>.
    2. If the ticket requires replacing text, strike through ONLY the outdated words/phrases (<s>...</s>) and place the updated text immediately after them inside the same sentence — do NOT duplicate the full original sentence.
    3. Do NOT repeat the old content again after striking it through.
    4. Keep the rest of the document exactly as it is — do not reflow paragraphs or remove unrelated content.
    5. Do NOT modify or reword unchanged text.
    6. Keep all HTML valid and Confluence-compatible.
    7. If replacing a value (numbers, codes, names, dates, etc.):
      - Keep the original value wrapped in <del>old value</del>
      - Immediately after, add the new value wrapped in <span style="background-color: yellow">new value</span>
    
    Current HTML:
    ${currentContent}
    
    Ticket ID: ${ticket.id}
    Title: ${ticket.title}
    Description: ${ticket.description}
    ${attachmentsHtml ? `Attachments: ${attachmentsHtml}` : ""}
    `;


  try {
    const llmRes = await axios.post(
      process.env.SAMSUNG_LLM_API_URL,
      {
        model: "latest",
        messages: [
          { role: "system", content: "You are a helpful documentation assistant." },
          { role: "user", content: prompt }
        ],
        stream: false,
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SAMSUNG_LLM_API_KEY}`,
          "X-Project-ID": "94c72648-7b4d-4f7b-a971-190738f15544",
          "X-User-ID": `${process.env.SAMSUNG_LLM_USER_ID}`
        }
      }
    );

    const llmOutput = llmRes.data.choices[0]?.message?.content?.trim();
    if (llmOutput) {
      return llmOutput.replace(/^```html\s*|\s*```$/g, "");
    }

    console.warn("LLM returned empty content — keeping original HTML.");
    return currentContent;
  } catch (err) {
    console.error("Failed to get updated HTML from LLM:", err.message);
    return currentContent;
  }
}

async function findRelevantDocsForTicketFromEmbeddings(ticket) {
  const docs = JSON.parse(fs.readFileSync("./data/vector_store.json", "utf-8"));

  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  const ticketText = `
    Title: ${ticket.title}
    Description: ${ticket.description}
    ${ticket.attachmentsText || ""}
  `;

  const ticketEmbeddingOutput = await extractor(ticketText, { pooling: "mean", normalize: true });
  const ticketEmbedding = Array.from(ticketEmbeddingOutput.data);

  const scoredDocs = docs.map(doc => ({
    ...doc,
    similarity: cosineSimilarity(ticketEmbedding, doc.embedding)
  }));

  scoredDocs.sort((a, b) => b.similarity - a.similarity);

  return scoredDocs.slice(0, 3);
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = {
  classifyTicket,
  summarizeConfluenceDoc,
  findRelevantDocsForTicket,
  generateUpdatedConfluenceHtml,
  findRelevantDocsForTicketFromEmbeddings
};

