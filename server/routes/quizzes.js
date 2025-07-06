// server/routes/quizzes.js
const router = require('express').Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const { createQuiz, listQuizzes, getQuiz } = require('../controllers/quizController');

router.post(
  '/',
  authenticate,
  authorizeRole('teacher'),
  createQuiz
);

router.get(
  '/',
  authenticate,
  listQuizzes
);

router.get(
  '/:id',
  authenticate,
  getQuiz
);

module.exports = router;
