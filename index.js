const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3').verbose();
const bot = new TelegramBot('8060999394:AAHivnbDHZ3XO0WVg9cm5ABoKj6cUxDUV8Q', { polling: true });
const db = new sqlite3.Database('./shop.db');

bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, '🎁 Привет! Открыть магазин можно через эту кнопку 👇', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🛍 Открыть магазин', web_app: { url: 'https://nft-gift-bot-23.onrender.com' } }]
      ]
    }
  });
});

bot.onText(/\/products/, msg => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err || !rows) return bot.sendMessage(msg.chat.id, 'Ошибка при получении товаров');
    if (rows.length === 0) return bot.sendMessage(msg.chat.id, 'Товары пока отсутствуют');
    let text = rows.map(p => `• ${p.name} — ${p.price} TON`).join('\n');
    bot.sendMessage(msg.chat.id, text);
  });
});
