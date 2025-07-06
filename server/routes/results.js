// server/routes/results.js
const router = require('express').Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const { submitQuiz, getLeaderboard, getResults } = require('../controllers/resultController');

router.post(
  '/:quizId/submit',
  authenticate,
  authorizeRole('student'),
  submitQuiz
);

router.get(
  '/leaderboard/:quizId',
  authenticate,
  getLeaderboard
);

router.get(
  '/',
  authenticate,
  authorizeRole('student'),
  getResults
);

module.exports = router;
