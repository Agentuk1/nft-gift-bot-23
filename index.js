const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || '8060999394:AAGfsWVfOXvQal5SuaTzkyCewQmMfarzxl4';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🎁 Добро пожаловать! Открыть магазин:", {
    reply_markup: {
      keyboard: [[{ text: "🛍 Открыть магазин", web_app: { url: 'https://nft-gift-bot-23.onrender.com' } }]],
      resize_keyboard: true
    }
  });
});
