// server/controllers/quizController.js
const db = require('../db');
const { generateMCQs } = require('../openai');

// POST /api/quizzes
async function createQuiz(req, res, next) {
  try {
    const { title, topic, description, totalQuestions, difficulty, timerMinutes } = req.body;
    const teacherId = req.user.id;
    // insert quiz metadata
    const quizRes = await db.query(
      `INSERT INTO quizzes
         (title, topic, description, total_questions, difficulty, teacher_id)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id`,
      [title, topic, description, totalQuestions, difficulty, teacherId]
    );
    const quizId = quizRes.rows[0].id;
    // generate questions
    const mcqs = await generateMCQs({ topic, totalQuestions, difficulty });
    // insert questions
    await Promise.all(mcqs.map(q =>
      db.query(
        `INSERT INTO questions
           (quiz_id, question_text, options, correct_answer)
         VALUES ($1,$2,$3,$4)`,
        [quizId, q.question, JSON.stringify(q.options), q.answer]
      )
    ));
    res.status(201).json({ quizId });
  } catch (err) {
    next(err);
  }
}

// GET /api/quizzes
async function listQuizzes(req, res, next) {
  try {
    const rows = await db.query(
      `SELECT id, title, topic, total_questions AS "totalQuestions", difficulty, teacher_id
       FROM quizzes`
    );
    res.json(rows.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/quizzes/teacher
async function listTeacherQuizzes(req, res, next) {
  try {
    const teacherId = req.user.id;
    const rows = await db.query(
      `SELECT id, title, topic, total_questions AS "totalQuestions", difficulty, created_at
       FROM quizzes
       WHERE teacher_id=$1
       ORDER BY created_at DESC`,
      [teacherId]
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
      `SELECT id, title, topic, description, total_questions AS "totalQuestions", difficulty
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

// GET /api/quizzes/:id/results
async function getQuizResults(req, res, next) {
  try {
    const quizId = req.params.id;
    const rows = await db.query(
      `SELECT s.name, s.enrollment_no, r.score, r.submitted_at
       FROM results r
       JOIN students s ON s.id = r.student_id
       WHERE r.quiz_id=$1
       ORDER BY r.score DESC, r.submitted_at ASC`,
      [quizId]
    );
    res.json(rows.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createQuiz,
  listQuizzes,
  getQuiz,
  listTeacherQuizzes,
  getQuizResults
};
