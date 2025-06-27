const db = new sqlite3.Database('./shop.db', (err) => {
  if (err) console.error(err.message);
  else console.log('База данных открыта');
});

// Инициализация, если база пуста
db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
  if (err) return console.error('Ошибка при проверке базы:', err.message);

  if (row.count === 0) {
    console.log('🔁 Таблица products пуста. Инициализируем...');
    const insertProducts = `
      INSERT INTO products (name, price, image) VALUES
      ('Подарочный стикерпак', 199, 'https://example.com/image1.png'),
      ('NFT-открытка', 299, 'https://example.com/image2.png'),
      ('Секретный подарок', 499, 'https://example.com/image3.png')
    `;
    db.run(insertProducts, (err) => {
      if (err) console.error('❌ Ошибка при вставке товаров:', err.message);
      else console.log('✅ Товары успешно добавлены');
    });
  } else {
    console.log('✅ Таблица products уже содержит данные');
  }
});

