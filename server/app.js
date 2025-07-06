// server/app.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const authRt  = require('./routes/auth');
const quizRt  = require('./routes/quizzes');
const resRt   = require('./routes/results');

const app = express();
app.use(cors());
app.use(express.json());

// mount routers
app.use('/api/auth', authRt);
app.use('/api/quizzes', quizRt);
app.use('/api/results', resRt);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));
