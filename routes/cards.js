const cards = require('express').Router();
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

const filePath = path.resolve('data', 'cards.json');

const sendCards = (async (req, res, next) => {
  try {
    const fileReader = await fs.createReadStream(filePath, { encoding: 'utf8' });
    return fileReader.pipe(res);
  } catch (error) {
    // отправляет ошибку в обработчик
    return next(error);
  }
});

const cardsServerError = (asyncHandler(async () => {
  throw new Error('Все сломалось... опять!');
}));

cards.get('/cards', sendCards);
cards.get('/cards', cardsServerError);

module.exports = cards;
