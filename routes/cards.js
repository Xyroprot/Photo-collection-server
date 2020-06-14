const cards = require('express').Router();
const fs = require('fs');
const path = require('path');

const filePath = path.resolve('data', 'cards.json');

const sendCards = (async (req, res) => {
  try {
    const fileReader = await fs.createReadStream(filePath, { encoding: 'utf8' });
    return fileReader.pipe(res.type('json'));
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Произошла ошибка при чтении данных' });
  }
});

cards.get('/cards', sendCards);

module.exports = cards;
