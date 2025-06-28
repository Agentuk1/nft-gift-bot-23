require('dotenv').config();
const axios = require('axios');

const TON_WALLET = process.env.TON_WALLET;

async function generateTonLink(amount) {
  return `https://ton.org/pay?amount=${amount}&to=${TON_WALLET}`;
}

module.exports = { generateTonLink };
