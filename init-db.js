require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

if (!fs.existsSync('./db')) fs.mkdirSync('./db');

const db = new sqlite3.Database('./db/shop.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT,
    rarity TEXT DEFAULT 'common'
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    purchase_date TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  const stmt = db.prepare("INSERT INTO products (name, price, image, rarity) VALUES (?, ?, ?, ?)");
  stmt.run("NFT–Стикерпак", 199, "https://example.com/img1.png", "rare");
  stmt.run("NFT–Открытка", 299, "https://example.com/img2.png", "epic");
  stmt.run("NFT–Подарок", 499, "https://example.com/img3.png", "legendary");
  stmt.finalize();
  console.log("✅ Инициализация БД завершена");
  db.close();
});
