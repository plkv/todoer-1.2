const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

async function migrateDays() {
  for (const day of weekDays) {
    const res = await pool.query(
      `UPDATE tasks SET day = to_char(created_at::date, 'YYYY-MM-DD') WHERE day = $1 RETURNING id, title, day, created_at`,
      [day]
    );
    if (res.rowCount > 0) {
      console.log(`Обновлено ${res.rowCount} задач с day = ${day}`);
      console.table(res.rows);
    }
  }
  await pool.end();
  console.log('Миграция завершена.');
}

migrateDays().catch(console.error); 