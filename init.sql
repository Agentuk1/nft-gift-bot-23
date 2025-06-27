CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT
);

INSERT INTO products (name, price, image) VALUES
('Подарочный стикерпак', 199, 'https://via.placeholder.com/150?text=Sticker'),
('NFT-открытка', 299, 'https://via.placeholder.com/150?text=NFT+Card'),
('Секретный подарок', 499, 'https://via.placeholder.com/150?text=Secret+Gift');
