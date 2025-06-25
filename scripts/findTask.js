const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function findTask() {
  const search = '%посчитать долг галине%';
  const res = await pool.query(
    "SELECT id, title, day, section, user_id, created_at FROM tasks WHERE title ILIKE $1 ORDER BY created_at DESC",
    [search]
  );
  console.log(res.rows);
  await pool.end();
}

findTask().catch(console.error); 