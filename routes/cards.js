const cards = require('express').Router();

const { getCards, createCard, deleteCard } = require('../controllers/cards');

cards.get('/cards', getCards); // возвращает все карточки
cards.post('/cards', createCard); // создаёт карточку
cards.delete('/cards/:cardId', deleteCard); // удаляет карточку по идентификатору

module.exports = cards;
