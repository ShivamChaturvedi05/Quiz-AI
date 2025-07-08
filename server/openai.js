// // server/openai.js
// const OpenAI = require('openai');
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// /**
//  * @param {{ topic: string, totalQuestions: number, difficulty: string }} opts
//  */
// async function generateMCQs({ topic, totalQuestions, difficulty }) {
//   const prompt = `
// Create ${totalQuestions} multiple-choice questions with 4 options each on the topic "${topic}" at ${difficulty} difficulty.
// Respond with a JSON array like:
// [
//   { "question": "…", "options": ["A","B","C","D"], "answer": "B" },
//   …
// ]
// `.trim();

//   const resp = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     messages: [{ role: 'user', content: prompt }],
//     temperature: 0.7,
//     max_tokens: 800
//   });

//   return JSON.parse(resp.choices[0].message.content);
// }

// module.exports = { generateMCQs };




const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // safe fallback
});

/**
 * Generate MCQs using OpenAI, or fallback to mock if error occurs.
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

  try {
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    return JSON.parse(resp.choices[0].message.content);
  } catch (error) {
    console.warn('[OpenAI Fallback] Using mock questions due to error:', error.code || error.message);

    return Array.from({ length: totalQuestions }, (_, i) => ({
      question: `Sample ${difficulty} question ${i + 1} on ${topic}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: 'Option A',
    }));
  }
}

module.exports = { generateMCQs };
