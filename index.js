import TelegramBot from 'node-telegram-bot-api';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

async function openDb() {
  return open({
    filename: './shop.db',
    driver: sqlite3.Database
  });
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Добро пожаловать в NFT магазин! Используйте /shop для просмотра товаров.');
});

bot.onText(/\/shop/, async (msg) => {
  const chatId = msg.chat.id;
  const db = await openDb();
  const products = await db.all('SELECT * FROM products');
  await db.close();

  if (products.length === 0) {
    return bot.sendMessage(chatId, 'Товары отсутствуют.');
  }

  for (const p of products) {
    const text = `${p.name}\nЦена: ${p.price} руб.`;
    const opts = {
      reply_markup: {
        inline_keyboard: [[
          { text: 'Купить', callback_data: `buy_${p.id}` }
        ]]
      }
    };
    await bot.sendPhoto(chatId, p.image, { caption: text, ...opts });
  }
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data.startsWith('buy_')) {
    const productId = data.split('_')[1];
    const db = await openDb();

    // Проверяем, есть ли продукт
    const product = await db.get('SELECT * FROM products WHERE id = ?', productId);
    if (!product) {
      await bot.answerCallbackQuery(query.id, { text: 'Товар не найден.' });
      await db.close();
      return;
    }

    await db.run('INSERT INTO purchases (user_id, product_id) VALUES (?, ?)', chatId, productId);
    await db.close();

    await bot.answerCallbackQuery(query.id, { text: 'Покупка успешна!' });
    bot.sendMessage(chatId, `Вы купили "${product.name}" за ${product.price} руб.`);
  }
});

bot.onText(/\/history/, async (msg) => {
  const chatId = msg.chat.id;
  const db = await openDb();

  const purchases = await db.all(`
    SELECT purchases.purchase_date, products.name, products.price 
    FROM purchases JOIN products ON purchases.product_id = products.id
    WHERE purchases.user_id = ? ORDER BY purchases.purchase_date DESC
  `, chatId);

  await db.close();

  if (purchases.length === 0) {
    return bot.sendMessage(chatId, 'У вас нет покупок.');
  }

  let text = 'Ваша история покупок:\n\n';
  for (const p of purchases) {
    text += `${p.name} — ${p.price} руб. — ${new Date(p.purchase_date).toLocaleString()}\n`;
  }

  bot.sendMessage(chatId, text);
});
