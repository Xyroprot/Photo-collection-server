const cards = require('express').Router();
const path = require('path');

const filePath = path.resolve('data', 'cards.json');
cards.get('/cards', (req, res) => {
  res.sendFile(filePath);
});

module.exports = cards;
