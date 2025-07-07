// server/controllers/authController.js
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

async function signup(req, res, next) {
  const { name, email, password, role } = req.body;
  const table = role === 'teacher' ? 'teachers' : 'students';
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO ${table} (name, email, ${role === 'student' ? 'enrollment_no, ' : ''}password_hash)
       VALUES ($1,$2,${role==='student'?'$3,':''}$${role==='student'?4:3})
       RETURNING id`,
      role === 'student'
        ? [name, email, req.body.enrollmentNo, hash]
        : [name, email, hash]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email or enrollment already exists' });
    }
    next(err);
  }
}

async function login(req, res, next) {
  const { email, password, role } = req.body;
  const table = role === 'teacher' ? 'teachers' : 'students';
  try {
    const userRes = await db.query(
      `SELECT id, password_hash FROM ${table} WHERE email=$1`,
      [email]
    );
    if (!userRes.rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const { id, password_hash } = userRes.rows[0];
    const valid = await bcrypt.compare(password, password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, role, userId: id });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };
