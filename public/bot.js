const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3').verbose();

// Токен бота (замени на свой)
const token = '8060999394:AAGfsWVfOXvQal5SuaTzkyCewQmMfarzxl4а';

// Создаем бота
const bot = new TelegramBot(token, { polling: true });

// Подключаем базу
const db = new sqlite3.Database('./shop.db', (err) => {
  if (err) {
    console.error('Ошибка подключения к базе:', err.message);
  } else {
    console.log('База данных открыта');
  }
});

// Команда /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Это NFT-магазин. Напиши /products, чтобы увидеть товары.');
});

// Команда /products — показать товары из базы
bot.onText(/\/products/, (msg) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      bot.sendMessage(msg.chat.id, 'Ошибка при получении товаров.');
      return console.error(err.message);
    }

    if (rows.length === 0) {
      bot.sendMessage(msg.chat.id, 'Товары отсутствуют.');
      return;
    }

    let response = 'Список товаров:\n\n';
    rows.forEach((product) => {
      response += `🛍️ ${product.name}\n💰 Цена: ${product.price} руб.\n\n`;
    });

    bot.sendMessage(msg.chat.id, response);
  });
});
