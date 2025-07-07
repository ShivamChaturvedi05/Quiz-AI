// server/app.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes   = require('./routes/auth');
const quizRoutes   = require('./routes/quizzes');
const resultRoutes = require('./routes/results');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',   authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
