const axios = require("axios");
require("dotenv").config();

async function classifyTicket(ticket) {
  const prompt = `
You are an AI documentation assistant.

Given a support ticket title and description, do the following:
1. Classify the ticket as either "Bug" or "Enhancement".
2. Summarize what product behavior has changed.
3. Suggest 2–3 keywords to locate the relevant doc.
4. Where in the system, assuming the system is e-commerce and what service like fulfillment, orders, catalog, sso, pricing etc. is impacted? and is it temporary or permanent? Return a JSON object with the following structure:
{
  "service": "service_name",
  "impact_location: "location_in_system",
  "is_permanent": "temporary_or_permanent"
}

Respond in JSON format.

Ticket Title: ${ticket.title}
Ticket Description: ${ticket.description}
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
          "X-Project-ID": '94c72648-7b4d-4f7b-a971-190738f15544',
          "X-User-ID": `${process.env.SAMSUNG_LLM_USER_ID}`

        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    if (!aiResponse) {
      throw new Error("No response from LLM");
    }

    let cleanedResponse = aiResponse.trim();
    cleanedResponse = cleanedResponse.replace(/^```json\s*|\s*```$/g, '');
    
    try {
      return JSON.parse(cleanedResponse);
    } catch (err) {
      console.error("Failed to parse LLM response:", {
        originalResponse: aiResponse,
        cleanedResponse: cleanedResponse,
        error: err.message
      });
      throw new Error(`Invalid JSON response from LLM: ${err.message}`);
    }

  } catch (err) {
    console.error("Failed to call LLM or parse response:", err.message);
    throw err;
  }
}

module.exports = { classifyTicket };
