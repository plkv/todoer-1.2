const request = require('supertest');
const express = require('express');

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const app = express();
app.get('/users', (req, res) => {
  res.status(200).json([{ id: 1, email: 'test@example.com' }]);
});

describe('Users API', () => {
  it('GET /users should return users array', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('email');
  });
}); 