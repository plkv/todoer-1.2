const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080', // Разрешаем запросы с фронтенда
  credentials: true, // Разрешаем передачу cookie
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure: process.env.NODE_ENV === 'production', // В продакшене использовать https
    // httpOnly: true,
    // maxAge: 24 * 60 * 60 * 1000 // 1 день
  }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// PostgreSQL DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    // Создаём таблицу пользователей
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        picture VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Таблица "users" готова.');

    // Создаём таблицу задач с внешним ключом на users
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        time_estimate TEXT,
      color TEXT,
      day TEXT,
      section TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Таблица "tasks" готова.');
  } catch (err) {
    console.error('Ошибка при создании таблиц:', err.stack);
  } finally {
    client.release();
  }
};

// Passport.js-конфигурация
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails, photos } = profile;
    const email = emails[0].value;
    const picture = photos[0].value;

    try {
      const client = await pool.connect();
      try {
        // Ищем пользователя
        let userResult = await client.query('SELECT * FROM users WHERE google_id = $1', [id]);
        let user = userResult.rows[0];

        // Если не найден, создаём нового
        if (!user) {
          userResult = await client.query(
            'INSERT INTO users (google_id, email, name, picture) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, email, displayName, picture]
          );
          user = userResult.rows[0];
          console.log('Создан новый пользователь:', user);
        } else {
          console.log('Пользователь найден:', user);
        }
        return done(null, user);
      } finally {
        client.release();
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

// Инициализация БД
pool.connect()
  .then(client => {
    console.log('Подключено к PostgreSQL базе данных.');
    client.release();
    createTables();
  })
  .catch(err => console.error('Ошибка подключения к базе:', err.stack));

// Middleware для проверки аутентификации
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Успешная аутентификация, перенаправляем на фронтенд
    res.redirect('http://localhost:8080');
  });

app.get('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// API Route to get user info
app.get('/api/user', ensureAuthenticated, (req, res) => {
  res.json(req.user);
});

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Получить все задачи
app.get('/api/tasks', ensureAuthenticated, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создать задачу
app.post('/api/tasks', ensureAuthenticated, async (req, res) => {
  const user_id = req.user.id;
  const { title, description, is_completed, time_estimate, color, day, section } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, is_completed, time_estimate, color, day, section) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [user_id, title, description, is_completed, time_estimate, color, day, section]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Обновить задачу
app.put('/api/tasks/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  
  try {
    // Получаем текущее состояние задачи
    const currentTaskResult = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (currentTaskResult.rowCount === 0) {
      return res.status(404).json({ error: 'Задача не найдена или у вас нет прав на её изменение' });
    }
    const currentTask = currentTaskResult.rows[0];

    // Объединяем старые данные с новыми, чтобы избежать null
    const newTaskData = { ...currentTask, ...body };
    const { title, description, is_completed, time_estimate, color, day, section } = newTaskData;

    const result = await pool.query(
      `UPDATE tasks SET 
        title=$1, 
        description=$2, 
        is_completed=$3, 
        time_estimate=$4, 
        color=$5, 
        day=$6, 
        section=$7, 
        updated_at=CURRENT_TIMESTAMP
       WHERE id=$8 AND user_id=$9 RETURNING *`,
      [title, description, is_completed, time_estimate, color, day, section, id, req.user.id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка обновления задачи:', err);
    res.status(500).json({ error: err.message });
  }
});

// Удалить задачу
app.delete('/api/tasks/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Задача не найдена или у вас нет прав на её удаление' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 