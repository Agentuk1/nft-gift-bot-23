const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || 'ТВОЙ_ТОКЕН_БОТА';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🎁 Добро пожаловать! Открыть магазин:", {
    reply_markup: {
      keyboard: [[{ text: "🛍 Открыть магазин", web_app: { url: 'https://твой-сайт.onrender.com' } }]],
      resize_keyboard: true
    }
  });
});
