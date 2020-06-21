const cards = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cards.get('/cards', getCards); // возвращает все карточки
cards.post('/cards', createCard); // создаёт карточку
cards.delete('/cards/:cardId', deleteCard); // удаляет карточку по идентификатору
cards.put('/cards/:cardId/likes', likeCard); // поставить лайк карточке
cards.delete('/cards/:cardId/likes', dislikeCard); // убрать лайк с карточки

module.exports = cards;
