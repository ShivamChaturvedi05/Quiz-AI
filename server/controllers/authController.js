// server/controllers/authController.js
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function signup(req, res, next) {
  const { name, email, enrollmentNo, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO students (name,email,enrollment_no,password_hash)
       VALUES ($1,$2,$3,$4) RETURNING id`,
      [name, email, enrollmentNo, hash]
    );
    // for MVP we store all in students table; role can be implicit
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email or enrollment already exists' });
    }
    next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const userRes = await db.query(
      `SELECT id, password_hash FROM students WHERE email=$1`,
      [email]
    );
    if (userRes.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = userRes.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // In a real app you’d fetch role; here assume teacher if email contains “teacher”
    const role = email.includes('@teacher') ? 'teacher' : 'student';
    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, role, userId: user.id });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };
