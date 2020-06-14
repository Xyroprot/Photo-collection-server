const cards = require('express').Router();
const fs = require('fs');
const path = require('path');

const filePath = path.resolve('data', 'cards.json');

cards.get('/cards', (req, res) => {
  res.sendFile(filePath);
});

module.exports = cards;
