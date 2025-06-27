const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('./shop.db', (err) => {
  if (err) {
    console.error('Ошибка открытия БД', err);
  } else {
    console.log('База данных открыта');
  }
});

// Отдаём статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

// API для получения товаров
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Ошибка при получении товаров' });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
