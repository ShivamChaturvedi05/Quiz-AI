// server/routes/results.js
const router = require('express').Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  submitQuiz,
  listStudentResults,
  getLeaderboard
} = require('../controllers/resultController');

// Student submits answers for a specific quiz
// POST /api/results/:quizId/submit
router.post(
  '/:quizId/submit',
  authenticate,
  authorizeRole('student'),
  submitQuiz
);

// Student lists their own results
// GET /api/results/student
router.get(
  '/student',
  authenticate,
  authorizeRole('student'),
  listStudentResults
);

// Leaderboard for a quiz (teacher or student view)
// GET /api/results/leaderboard/:quizId
router.get(
  '/leaderboard/:quizId',
  authenticate,
  getLeaderboard
);

module.exports = router;
