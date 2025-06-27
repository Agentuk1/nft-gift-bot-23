const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

const db = new sqlite3.Database('./shop.db', (err) => {
  if (err) console.error(err.message);
  else console.log('База данных открыта');
});

app.use(express.json());
app.use(express.static('public')); // для статики (картинки, CSS)

app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/purchase', (req, res) => {
  const { user_id, product_id } = req.body;
  if (!user_id || !product_id) return res.status(400).json({ error: 'Нужны user_id и product_id' });

  const stmt = db.prepare('INSERT INTO purchases (user_id, product_id) VALUES (?, ?)');
  stmt.run(user_id, product_id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, purchase_id: this.lastID });
  });
});

app.get('/purchases/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  db.all(`SELECT p.id, p.name, p.price, p.image, pur.purchase_date 
          FROM purchases pur 
          JOIN products p ON pur.product_id = p.id 
          WHERE pur.user_id = ?`, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});
