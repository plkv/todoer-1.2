const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite DB
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Ошибка подключения к базе:', err.message);
  } else {
    console.log('Подключено к SQLite базе данных.');
    // Создаём таблицу задач, если не существует
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      isCompleted INTEGER DEFAULT 0,
      timeEstimate TEXT,
      color TEXT,
      day TEXT,
      section TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Получить все задачи
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Создать задачу
app.post('/api/tasks', (req, res) => {
  const { title, description, isCompleted, timeEstimate, color, day, section } = req.body;
  db.run(
    `INSERT INTO tasks (title, description, isCompleted, timeEstimate, color, day, section) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, isCompleted ? 1 : 0, timeEstimate, color, day, section],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(row);
      });
    }
  );
});

// Обновить задачу
app.put('/api/tasks/:id', (req, res) => {
  const { title, description, isCompleted, timeEstimate, color, day, section } = req.body;
  const { id } = req.params;
  db.run(
    `UPDATE tasks SET title=?, description=?, isCompleted=?, timeEstimate=?, color=?, day=?, section=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?`,
    [title, description, isCompleted ? 1 : 0, timeEstimate, color, day, section, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
      });
    }
  );
});

// Удалить задачу
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 