const axios = require("axios");
require("dotenv").config();

async function classifyTicket(ticket) {
  const prompt = `
You are an AI documentation assistant.

Given a support ticket title and description, do the following:
1. Classify the ticket as either "Bug" or "Enhancement".
2. Summarize what product behavior has changed.
3. Suggest what section of product documentation should be updated.
4. Suggest 2–3 keywords to locate the relevant doc.

Respond in JSON format.

Ticket Title: ${ticket.title}
Ticket Description: ${ticket.description}
`;

  try {
    const response = await axios.post(
      process.env.SAMSUNG_API_URL,
      {
        model: "Gausso",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SAMSUNG_API_KEY}`
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    if (!aiResponse) {
      throw new Error("No response from LLM");
    }

    return JSON.parse(aiResponse);

  } catch (err) {
    console.error("Failed to call LLM or parse response:", err.message);
    throw err;
  }
}

module.exports = { classifyTicket };
