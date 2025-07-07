// server/openai.js
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * @param {{ topic: string, totalQuestions: number, difficulty: string }} opts
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

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 800
  });

  return JSON.parse(resp.choices[0].message.content);
}

module.exports = { generateMCQs };
