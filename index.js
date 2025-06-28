require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const WEB_URL = process.env.WEB_URL || `https://nft-gift-bot-23.onrender.com`;

bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, "🎁 Магазин открыт", {
    reply_markup: {
      inline_keyboard: [[{ text: "🛍 Открыть магазин", web_app: { url: WEB_URL } }]]
    }
  });
});

bot.onText(/\/history/, async msg => {
  const resp = await axios.get(`${WEB_URL}/purchases/${msg.from.id}`);
  const lst = resp.data;
  let out = "🧾 История покупок:\n\n" + (lst.length ? lst.map(p=>`• ${p.name} (${p.price} TON)`).join("\n") : "Покупок нет");
  bot.sendMessage(msg.chat.id, out);
});
