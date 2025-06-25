const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function findAllTasks() {
  const res = await pool.query(
    "SELECT id, title, day, section, user_id, created_at FROM tasks ORDER BY created_at DESC"
  );
  console.log(res.rows);
  await pool.end();
}

findAllTasks().catch(console.error); 