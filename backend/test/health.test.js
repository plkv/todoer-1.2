const request = require('supertest');
const express = require('express');

const app = express();
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

describe('GET /health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
}); 