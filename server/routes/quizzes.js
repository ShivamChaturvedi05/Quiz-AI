// server/routes/quizzes.js
const router = require('express').Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  createQuiz,
  listQuizzes,
  getQuiz,
  listTeacherQuizzes,
  getQuizResults
} = require('../controllers/quizController');

router.post('/', authenticate, authorizeRole('teacher'), createQuiz);
router.get('/', authenticate, listQuizzes);
router.get('/teacher', authenticate, authorizeRole('teacher'), listTeacherQuizzes);
router.get('/:id', authenticate, getQuiz);
router.get('/:id/results', authenticate, authorizeRole('teacher'), getQuizResults);

module.exports = router;
