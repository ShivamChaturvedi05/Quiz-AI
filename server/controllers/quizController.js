// server/controllers/quizController.js
const db = require('../db');
const { generateMCQs } = require('../openai');

// POST /api/quizzes
async function createQuiz(req, res, next) {
  try {
    const { title, topic, description, totalQuestions, difficulty } = req.body;
    const teacherId = req.user.id;
    const quizRes = await db.query(
      `INSERT INTO quizzes
       (title, topic, description, total_questions, difficulty, created_by)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [title, topic, description, totalQuestions, difficulty, teacherId]
    );
    const quizId = quizRes.rows[0].id;

    const mcqs = await generateMCQs({ topic, totalQuestions, difficulty });
    for (const q of mcqs) {
      await db.query(
        `INSERT INTO questions (quiz_id, question_text, options, correct_answer)
         VALUES ($1,$2,$3,$4)`,
        [quizId, q.question, JSON.stringify(q.options), q.answer]
      );
    }
    res.status(201).json({ quizId });
  } catch (err) {
    next(err);
  }
}

// GET /api/quizzes
async function listQuizzes(req, res, next) {
  try {
    const rows = await db.query(
      `SELECT id, title, topic, total_questions, difficulty, created_by
       FROM quizzes`
    );
    res.json(rows.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/quizzes/:id
async function getQuiz(req, res, next) {
  try {
    const { id } = req.params;
    const quizRes = await db.query(
      `SELECT id, title, topic, total_questions AS "totalQuestions", difficulty
       FROM quizzes WHERE id=$1`,
      [id]
    );
    if (!quizRes.rows.length) return res.status(404).json({ message: 'Quiz not found' });

    const questionsRes = await db.query(
      `SELECT id, question_text AS questionText, options
       FROM questions WHERE quiz_id=$1`,
      [id]
    );
    res.json({
      ...quizRes.rows[0],
      questions: questionsRes.rows
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createQuiz, listQuizzes, getQuiz };
