import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const PORT = 3000;

app.use(express.json());

async function openDb() {
  return open({
    filename: './shop.db',
    driver: sqlite3.Database
  });
}

app.get('/products', async (req, res) => {
  const db = await openDb();
  const products = await db.all('SELECT * FROM products');
  res.json(products);
  await db.close();
});

app.get('/purchases/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  const db = await openDb();
  const purchases = await db.all(`
    SELECT purchases.purchase_date, products.name, products.price 
    FROM purchases JOIN products ON purchases.product_id = products.id 
    WHERE purchases.user_id = ? ORDER BY purchases.purchase_date DESC
  `, userId);
  res.json(purchases);
  await db.close();
});

app.post('/purchase', async (req, res) => {
  const { user_id, product_id } = req.body;
  if (!user_id || !product_id) return res.json({ success: false, error: 'Нет user_id или product_id' });

  const db = await openDb();

  // Проверяем, есть ли такой продукт
  const product = await db.get('SELECT * FROM products WHERE id = ?', product_id);
  if (!product) {
    await db.close();
    return res.json({ success: false, error: 'Продукт не найден' });
  }

  await db.run('INSERT INTO purchases (user_id, product_id) VALUES (?, ?)', user_id, product_id);
  await db.close();

  res.json({ success: true });
});

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`🚀 Сервер на http://localhost:${PORT}`);
});
