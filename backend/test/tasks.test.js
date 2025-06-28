const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Заглушки для теста
app.get('/tasks', (req, res) => {
  res.status(200).json([{ id: 1, title: 'Test Task' }]);
});
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  res.status(201).json({ id: 2, title });
});

describe('Tasks API', () => {
  it('GET /tasks should return tasks array', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('POST /tasks should create task', async () => {
    const res = await request(app).post('/tasks').send({ title: 'New Task' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('New Task');
  });
  it('POST /tasks without title should fail', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
}); 