const db = require('../db');

/**
 * POST /api/results/:quizId/submit
 * Body: { answers: [{ questionId, answer }, ...] }
 */
async function submitQuiz(req, res, next) {
  const studentId = req.user.id;
  const quizId = parseInt(req.params.quizId, 10);
  const { answers } = req.body;

  try {
    // 1️⃣ Fetch correct answers from DB
    const qRes = await db.query(
      `SELECT id, correct_answer 
         FROM questions 
        WHERE quiz_id = $1`,
      [quizId]
    );

    // Build map of question ID to normalized correct answer
    const correctMap = Object.fromEntries(
      qRes.rows.map(row => [row.id, row.correct_answer?.trim().toLowerCase()])
    );

    // 👇 Normalization function to safely compare strings
    const normalize = str =>
    String(str || '')
      .normalize('NFKC')
      .replace(/[^\w\s]/g, '') // remove punctuation
      .trim()
      .toLowerCase();


    let score = 0;
    for (const { questionId, answer } of answers) {
      const correct = correctMap[questionId];
      if (normalize(correct) === normalize(answer)) {
        score++;
      } else {
        console.log(`Mismatch for Q${questionId}: Expected "${correct}", Got "${answer}"`);
      }
    }



    // 3️⃣ Upsert result into results table
    await db.query(
      `INSERT INTO results (student_id, quiz_id, score, submitted_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (student_id, quiz_id)
       DO UPDATE SET 
         score = EXCLUDED.score,
         submitted_at = NOW()`,
      [studentId, quizId, score]
    );

    // 4️⃣ Respond with the score
    res.json({ score });
  } catch (err) {
    console.error('❌ Error submitting quiz:', err);
    next(err);
  }
}

/**
 * GET /api/results/student
 * Returns: [{ quiz_id, score, submitted_at }]
 */
async function listStudentResults(req, res, next) {
  const studentId = req.user.id;
  try {
    const dbRes = await db.query(
      `SELECT quiz_id, score, submitted_at 
         FROM results 
        WHERE student_id = $1
        ORDER BY submitted_at DESC`,
      [studentId]
    );
    res.json(dbRes.rows);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/results/leaderboard/:quizId
 * Returns top scores for a quiz
 */
async function getLeaderboard(req, res, next) {
  const quizId = parseInt(req.params.quizId, 10);
  try {
    const dbRes = await db.query(
      `SELECT s.name,
              s.enrollment_no AS enrollmentNo,
              r.score,
              r.submitted_at AS submittedAt
         FROM results r
         JOIN students s ON s.id = r.student_id
        WHERE r.quiz_id = $1
        ORDER BY r.score DESC, r.submitted_at
        LIMIT 10`,
      [quizId]
    );
    res.json(dbRes.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitQuiz,
  listStudentResults,
  getLeaderboard,
};
