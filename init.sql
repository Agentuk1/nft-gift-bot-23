const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./shop.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price INTEGER,
    image TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    purchase_date TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.get('SELECT COUNT(*) AS cnt FROM products', (err, row) => {
    if (row && row.cnt > 0) return console.log('Товары уже добавлены');
    const stmt = db.prepare("INSERT INTO products (name, price, image) VALUES (?, ?, ?)");
    stmt.run("Подарочный стикерпак", 199, "https://example.com/image1.png");
    stmt.run("NFT‑открытка", 299, "https://example.com/image2.png");
    stmt.run("Секретный подарок", 499, "https://example.com/image3.png");
    stmt.finalize(() => console.log('✅ Стартовые товары добавлены'));
  });
});

db.close();
