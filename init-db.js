const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./shop.db');

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS products");
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price INTEGER,
    image TEXT
  )`);

  const stmt = db.prepare("INSERT INTO products (name, price, image) VALUES (?, ?, ?)");
  stmt.run("Подарочный стикерпак", 199, "https://example.com/image1.png");
  stmt.run("NFT-открытка", 299, "https://example.com/image2.png");
  stmt.run("Секретный подарок", 499, "https://example.com/image3.png");
  stmt.finalize();

  console.log("✅ База данных инициализирована");
});

db.close();
