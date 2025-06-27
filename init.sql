CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT
);

CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  purchase_date TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, price, image) VALUES
('NFT Стикерпак', 199, 'https://example.com/image1.png'),
('NFT Открытка', 299, 'https://example.com/image2.png'),
('NFT Подарок', 499, 'https://example.com/image3.png');
