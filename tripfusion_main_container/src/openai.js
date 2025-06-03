//
// openai.js
// Helper to generate AI-powered itinerary using OpenAI API (chat/completions endpoint)
// Reads API key from process.env.REACT_APP_OPENAI_API_KEY
//

// PUBLIC_INTERFACE
/**
 * Generates a travel itinerary using OpenAI's GPT model based on user trip details.
 * @param {Object} options
 * @param {string} options.destination - Destination city or place
 * @param {string} options.startDate - Start date (YYYY-MM-DD)
 * @param {string} options.endDate - End date (YYYY-MM-DD)
 * @param {string[]} options.interests - List of interests (e.g., nature, food, history)
 * @param {string|number} [options.budget] - Optional: budget in USD
 * @returns {Promise<string>} - Itinerary as plain text or throws error
 */
export async function fetchOpenAIItinerary({
  destination,
  startDate,
  endDate,
  interests,
  budget
}) {
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error(
      "OpenAI API key not set. Add REACT_APP_OPENAI_API_KEY to your .env file in the project root."
    );
  }
  if (!destination || !startDate || !endDate) {
    throw new Error("Missing required trip details (destination, start date, end date).");
  }

  // Compose prompt
  const dayCount = daysBetween(startDate, endDate) || 3;
  let prompt = `Create a detailed, day-by-day ${dayCount}-day travel itinerary for a trip to ${destination}`;
  if (interests && interests.length) prompt += ` with a focus on ${interests.join(", ")}`;
  prompt += `, from ${startDate} to ${endDate}.`;
  if (budget) prompt += ` The trip budget is approximately $${budget} USD.`;
  prompt += " Please include top attractions, meals, and unique experiences. Keep each day on its own line, and use a readable but compact format. Do not use markdown or HTML, just plain text.";

  // OpenAI API payload
  const body = {
    model: "gpt-3.5-turbo", // Or change to another available model
    messages: [
      { role: "system", content: "You are a travel agent that creates detailed, inspiring, but concise travel plans." },
      { role: "user", content: prompt }
    ],
    temperature: 0.85,
    max_tokens: 900
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let errMsg = `API error: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error && errorData.error.message) {
        errMsg = errorData.error.message;
      }
    } catch {}
    throw new Error(`OpenAI API Error: ${errMsg}`);
  }
  const data = await response.json();
  // Defensive: response.choices[0].message.content
  if (
    !data ||
    !data.choices ||
    !data.choices[0] ||
    !data.choices[0].message ||
    !data.choices[0].message.content
  ) {
    throw new Error("Malformed OpenAI API response.");
  }
  return data.choices[0].message.content.trim();
}

// Helper: count days (inclusive)
function daysBetween(start, end) {
  if (!start || !end) return null;
  const sd = new Date(start), ed = new Date(end);
  return Math.max(1, Math.round((ed - sd) / (1000 * 60 * 60 * 24)) + 1);
}
