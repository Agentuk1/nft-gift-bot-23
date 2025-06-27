const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('./shop.db');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/products', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) return res.status(500).json({ error: 'Ошибка получения товаров' });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});
