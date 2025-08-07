const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
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

module.exports = { classifyTicket };
