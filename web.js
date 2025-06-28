require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const ton = require('./utils/ton');

const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('./db/shop.db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index'));
app.get('/products', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows));
});
app.post('/purchase', async (req, res) => {
  const { user_id, product_id } = req.body;
  if (!user_id || !product_id) return res.status(400).json({ error: 'Нужно user_id и product_id' });
  const row = await new Promise(r=>db.get("SELECT * FROM products WHERE id=?", [product_id], (e,rw)=>r(rw)));
  if (!row) return res.status(404).json({ error: 'Товар не найден' });
  const link = await ton.generateTonLink(row.price);
  db.run("INSERT INTO purchases (user_id, product_id) VALUES (?, ?)", [user_id, product_id]);
  res.json({ success: true, link });
});
app.get('/purchases/:user_id', (req, res) => {
  db.all(`SELECT p.id, p.name, p.price, pr.purchase_date
          FROM purchases pr JOIN products p ON pr.product_id=p.id
          WHERE pr.user_id=?`, [req.params.user_id], (e,r)=>e?res.status(500).json({error:e.message}):res.json(r));
});

app.listen(PORT, () => console.log(`✅ Web запущен на http://localhost:${PORT}`));
