# Health-check endpoint

Добавить в backend/index.js:

```js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
```

Проверка: GET http://localhost:3001/health должен вернуть { status: 'ok' }. 