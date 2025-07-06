// server/openai.js
const OpenAI = require("openai");

// Instantiate the client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate an array of MCQs via OpenAI
 * @param {{ topic: string, totalQuestions: number, difficulty: string }} params
 * @returns {Promise<Array<{ question: string, options: string[], answer: string }>>}
 */
async function generateMCQs({ topic, totalQuestions, difficulty }) {
  const prompt = `
Create ${totalQuestions} multiple-choice questions with 4 options each on the topic "${topic}" at ${difficulty} difficulty.
Respond with a JSON array like:
[
  { "question": "…", "options": ["A","B","C","D"], "answer": "B" },
  …
]
  `.trim();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 800
  });

  const text = response.choices[0].message.content;
  // Parse the JSON array from the model’s reply
  return JSON.parse(text);
}

module.exports = { generateMCQs };
