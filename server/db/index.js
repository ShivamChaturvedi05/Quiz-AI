// server/db/index.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false } // enable if needed
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
