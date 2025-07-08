// // // server/routes/quizzes.js
// // const router = require('express').Router();
// // const { authenticate, authorizeRole } = require('../middleware/auth');
// // const {
// //   createQuiz,
// //   listQuizzes,
// //   getQuiz,
// //   listTeacherQuizzes,
// //   getQuizResults
// // } = require('../controllers/quizController');

// // router.post('/', authenticate, authorizeRole('teacher'), createQuiz);
// // router.get('/', authenticate, listQuizzes);
// // router.get('/teacher', authenticate, authorizeRole('teacher'), listTeacherQuizzes);
// // router.get('/:id', authenticate, getQuiz);
// // router.get('/:id/results', authenticate, authorizeRole('teacher'), getQuizResults);

// // module.exports = router;


// // server/routes/quizzes.js
// const router = require('express').Router();
// const { authenticate, authorizeRole } = require('../middleware/auth');
// const {
//   createQuiz,
//   listQuizzes,
//   getQuiz,
//   listTeacherQuizzes,
//   listStudentQuizzes,    // ← import the new handler
//   getQuizResults
// } = require('../controllers/quizController');

// // Teachers create & list their quizzes
// router.post('/',         authenticate, authorizeRole('teacher'), createQuiz);
// router.get('/teacher',   authenticate, authorizeRole('teacher'), listTeacherQuizzes);

// // Students list their pending vs completed quizzes
// router.get(
//   '/student',            // ← new endpoint
//   authenticate,
//   authorizeRole('student'),
//   listStudentQuizzes
// );

// // Anyone authenticated can view quiz details
// router.get('/',           authenticate, listQuizzes);
// router.get('/:id',        authenticate, getQuiz);

// // Teachers view results
// router.get(
//   '/:id/results',
//   authenticate,
//   authorizeRole('teacher'),
//   getQuizResults
// );

// module.exports = router;


// server/routes/quizzes.js
const router = require('express').Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  createQuiz,
  listQuizzes,
  getQuiz,
  listTeacherQuizzes,
  listStudentQuizzes,    // ← make sure this is imported
  getQuizResults
} = require('../controllers/quizController');

// ─── Teacher endpoints ────────────────────────────────────────────────────────

// Create a new quiz
router.post(
  '/',
  authenticate,
  authorizeRole('teacher'),
  createQuiz
);

// List quizzes created by the logged‑in teacher
router.get(
  '/teacher',
  authenticate,
  authorizeRole('teacher'),
  listTeacherQuizzes
);

// ─── Student endpoints ────────────────────────────────────────────────────────

// List pending vs completed quizzes for the logged‑in student
router.get(
  '/student',
  authenticate,
  authorizeRole('student'),
  listStudentQuizzes
);

// ─── General authenticated endpoints ───────────────────────────────────────────

// List all quizzes (e.g. for admin or general view)
router.get(
  '/',
  authenticate,
  listQuizzes
);

// Fetch a single quiz (questions included)
router.get(
  '/:id',
  authenticate,
  getQuiz
);

// ─── Teacher results endpoint ─────────────────────────────────────────────────

// View results for a specific quiz
router.get(
  '/:id/results',
  authenticate,
  authorizeRole('teacher'),
  getQuizResults
);

module.exports = router;
