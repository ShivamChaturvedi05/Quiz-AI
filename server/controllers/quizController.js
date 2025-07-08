// // server/controllers/quizController.js
// const db = require('../db');
// const { generateMCQs } = require('../openai');

// // POST /api/quizzes
// async function createQuiz(req, res, next) {
//   try {
//     const { title, topic, description, totalQuestions, difficulty, timerMinutes } = req.body;
//     const teacherId = req.user.id;
//     // insert quiz metadata
//     const quizRes = await db.query(
//       `INSERT INTO quizzes
//          (title, topic, description, total_questions, difficulty, teacher_id)
//        VALUES ($1,$2,$3,$4,$5,$6)
//        RETURNING id`,
//       [title, topic, description, totalQuestions, difficulty, teacherId]
//     );
//     const quizId = quizRes.rows[0].id;
//     // generate questions
//     const mcqs = await generateMCQs({ topic, totalQuestions, difficulty });
//     // insert questions
//     await Promise.all(mcqs.map(q =>
//       db.query(
//         `INSERT INTO questions
//            (quiz_id, question_text, options, correct_answer)
//          VALUES ($1,$2,$3,$4)`,
//         [quizId, q.question, JSON.stringify(q.options), q.answer]
//       )
//     ));
//     res.status(201).json({ quizId });
//   } catch (err) {
//     next(err);
//   }
// }

// // GET /api/quizzes
// async function listQuizzes(req, res, next) {
//   try {
//     const rows = await db.query(
//       `SELECT id, title, topic, total_questions AS "totalQuestions", difficulty, teacher_id
//        FROM quizzes`
//     );
//     res.json(rows.rows);
//   } catch (err) {
//     next(err);
//   }
// }

// // GET /api/quizzes/teacher
// async function listTeacherQuizzes(req, res, next) {
//   try {
//     const teacherId = req.user.id;
//     const rows = await db.query(
//       `SELECT id, title, topic, total_questions AS "totalQuestions", difficulty, created_at
//        FROM quizzes
//        WHERE teacher_id=$1
//        ORDER BY created_at DESC`,
//       [teacherId]
//     );
//     res.json(rows.rows);
//   } catch (err) {
//     next(err);
//   }
// }

// // GET /api/quizzes/:id
// async function getQuiz(req, res, next) {
//   try {
//     const { id } = req.params;
//     const quizRes = await db.query(
//       `SELECT id, title, topic, description, total_questions AS "totalQuestions", difficulty
//        FROM quizzes WHERE id=$1`,
//       [id]
//     );
//     if (!quizRes.rows.length) return res.status(404).json({ message: 'Quiz not found' });

//     const questionsRes = await db.query(
//       `SELECT id, question_text AS questionText, options
//        FROM questions WHERE quiz_id=$1`,
//       [id]
//     );
//     res.json({
//       ...quizRes.rows[0],
//       questions: questionsRes.rows
//     });
//   } catch (err) {
//     next(err);
//   }
// }

// // GET /api/quizzes/:id/results
// async function getQuizResults(req, res, next) {
//   try {
//     const quizId = req.params.id;
//     const rows = await db.query(
//       `SELECT s.name, s.enrollment_no, r.score, r.submitted_at
//        FROM results r
//        JOIN students s ON s.id = r.student_id
//        WHERE r.quiz_id=$1
//        ORDER BY r.score DESC, r.submitted_at ASC`,
//       [quizId]
//     );
//     res.json(rows.rows);
//   } catch (err) {
//     next(err);
//   }
// }

// module.exports = {
//   createQuiz,
//   listQuizzes,
//   getQuiz,
//   listTeacherQuizzes,
//   getQuizResults
// };


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
         (title, topic, description, total_questions, difficulty, teacher_id, timer_minutes)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id`,
      [title, topic, description, totalQuestions, difficulty, teacherId, timerMinutes]
    );
    const quizId = quizRes.rows[0].id;

    // generate questions via OpenAI
    const mcqs = await generateMCQs({ topic, totalQuestions, difficulty });

    // insert questions
    await Promise.all(
      mcqs.map(q =>
        db.query(
          `INSERT INTO questions
             (quiz_id, question_text, options, correct_answer)
           VALUES ($1,$2,$3,$4)`,
          [quizId, q.question, JSON.stringify(q.options), q.answer]
        )
      )
    );

    res.status(201).json({ quizId });
  } catch (err) {
    next(err);
  }
}

// GET /api/quizzes
// (for listing all quizzes, e.g. admin view)
async function listQuizzes(req, res, next) {
  try {
    const rows = await db.query(
      `SELECT
         id,
         title,
         topic,
         total_questions    AS "totalQuestions",
         difficulty,
         teacher_id         AS "teacherId",
         created_at         AS "createdAt"
       FROM quizzes
       ORDER BY created_at DESC`
    );
    res.json(rows.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/quizzes/teacher
// (for teachers to see their own quizzes)
async function listTeacherQuizzes(req, res, next) {
  try {
    const teacherId = req.user.id;
    const rows = await db.query(
      `SELECT
         id,
         title,
         topic,
         total_questions    AS "totalQuestions",
         difficulty,
         created_at         AS "createdAt"
       FROM quizzes
       WHERE teacher_id = $1
       ORDER BY created_at DESC`,
      [teacherId]
    );
    res.json(rows.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/quizzes/student
// (for students to see pending vs completed)
async function listStudentQuizzes(req, res, next) {
  try {
    const studentId = req.user.id;
    const { rows } = await db.query(
      `SELECT
         q.id,
         q.title,
         q.topic,
         q.total_questions    AS "totalQuestions",
         q.difficulty,
         q.timer_minutes      AS "timerMinutes",
         EXISTS(
           SELECT 1
           FROM results r
           WHERE r.quiz_id    = q.id
             AND r.student_id = $1
         )                     AS completed,
         (SELECT r.submitted_at
          FROM results r
          WHERE r.quiz_id    = q.id
            AND r.student_id = $1
          ORDER BY r.submitted_at DESC
          LIMIT 1
         )                     AS completedAt
       FROM quizzes q
       ORDER BY q.created_at DESC`,
      [studentId]
    );

    const pending   = rows.filter(r => !r.completed);
    const completed = rows.filter(r =>  r.completed);

    res.json({ pending, completed });
  } catch (err) {
    next(err);
  }
}

// GET /api/quizzes/:id
// (fetch quiz details + questions)
async function getQuiz(req, res, next) {
  try {
    const { id } = req.params;
    const quizRes = await db.query(
      `SELECT
         id,
         title,
         topic,
         description,
         total_questions    AS "totalQuestions",
         difficulty,
         timer_minutes      AS "timerMinutes"
       FROM quizzes
       WHERE id = $1`,
      [id]
    );
    if (quizRes.rows.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const questionsRes = await db.query(
      `SELECT
         id,
         question_text     AS "questionText",
         options
       FROM questions
       WHERE quiz_id = $1`,
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
// (teacher view of results for a given quiz)
async function getQuizResults(req, res, next) {
  try {
    const quizId = req.params.id;
    const rows = await db.query(
      `SELECT
         s.name,
         s.enrollment_no   AS "enrollmentNo",
         r.score,
         r.submitted_at    AS "submittedAt"
       FROM results r
       JOIN students s ON s.id = r.student_id
       WHERE r.quiz_id = $1
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
  listTeacherQuizzes,
  listStudentQuizzes,
  getQuiz,
  getQuizResults
};
