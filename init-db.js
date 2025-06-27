import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function init() {
  const db = await open({
    filename: './shop.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price INTEGER,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      product_id INTEGER,
      purchase_date TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Добавим 12 товаров
  const products = [
    ["NFT Стикерпак", 199, "https://example.com/image1.png"],
    ["NFT Открытка", 299, "https://example.com/image2.png"],
    ["Секретный подарок", 499, "https://example.com/image3.png"],
    ["Эксклюзивный арт", 999, "https://example.com/image4.png"],
    ["Портрет от художника", 1200, "https://example.com/image5.png"],
    ["Виртуальная футболка", 700, "https://example.com/image6.png"],
    ["Мем NFT", 150, "https://example.com/image7.png"],
    ["Редкий скин", 1800, "https://example.com/image8.png"],
    ["NFT Музыка", 400, "https://example.com/image9.png"],
    ["Цифровой постер", 250, "https://example.com/image10.png"],
    ["Анимированная открытка", 350, "https://example.com/image11.png"],
    ["VIP доступ", 2000, "https://example.com/image12.png"]
  ];

  // Очистим таблицу и добавим товары заново
  await db.exec('DELETE FROM products');
  for (const [name, price, image] of products) {
    await db.run('INSERT INTO products (name, price, image) VALUES (?, ?, ?)', name, price, image);
  }

  console.log("База и товары инициализированы");
  await db.close();
}

init();
