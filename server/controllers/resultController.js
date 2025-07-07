// server/controllers/resultController.js
const db = require('../db');

// POST /api/results/:quizId/submit
async function submitQuiz(req, res, next) {
  try {
    const studentId = req.user.id;
    const { quizId } = req.params;
    const { answers } = req.body; // [{questionId, answer},...]
    // fetch correct answers
    const qRes = await db.query(
      'SELECT id, correct_answer FROM questions WHERE quiz_id=$1',
      [quizId]
    );
    const correctMap = Object.fromEntries(qRes.rows.map(r => [r.id, r.correct_answer]));
    let score = 0;
    for (let { questionId, answer } of answers) {
      if (correctMap[questionId] === answer) score++;
    }
    // upsert result
    await db.query(
      `INSERT INTO results(student_id, quiz_id, score)
       VALUES($1,$2,$3)
       ON CONFLICT (student_id,quiz_id) DO UPDATE
         SET score=EXCLUDED.score, submitted_at=NOW()`,
      [studentId, quizId, score]
    );
    res.json({ score });
  } catch (err) {
    next(err);
  }
}

// GET /api/results?studentId=…
async function listStudentResults(req, res, next) {
  try {
    const studentId = req.user.id;
    const rows = await db.query(
      'SELECT quiz_id, score, submitted_at FROM results WHERE student_id=$1',
      [studentId]
    );
    res.json(rows.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/results/leaderboard/:quizId
async function getLeaderboard(req, res, next) {
  try {
    const quizId = req.params.quizId;
    const rows = await db.query(
      `SELECT s.name, s.enrollment_no, r.score
       FROM results r
       JOIN students s ON s.id = r.student_id
       WHERE r.quiz_id=$1
       ORDER BY r.score DESC
       LIMIT 10`,
      [quizId]
    );
    res.json(rows.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { submitQuiz, listStudentResults, getLeaderboard };
