// server/routes/results.js
const router = require('express').Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const { submitQuiz, listStudentResults, getLeaderboard } = require('../controllers/resultController');

router.post('/:quizId/submit', authenticate, authorizeRole('student'), submitQuiz);
router.get('/', authenticate, authorizeRole('student'), listStudentResults);
router.get('/leaderboard/:quizId', authenticate, getLeaderboard);

module.exports = router;
