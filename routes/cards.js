const cards = require('express').Router();
const validator = require('validator');
const {
  celebrate, Joi, errors, Segments,
} = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { BadRequesError } = require('../errors/errors-bundle');

const urlValidator = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.error(new BadRequesError('Произошла ошибка при обработке запроса'));
  }
  return value;
};

cards.get('/cards', celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), getCards); // возвращает все карточки

cards.post('/cards', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(urlValidator).required(),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), createCard); // создаёт карточку

cards.delete('/cards/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), deleteCard); // удаляет карточку по идентификатору

cards.put('/cards/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), likeCard); // поставить лайк карточке

cards.delete('/cards/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), dislikeCard); // убрать лайк с карточки

cards.use(errors());

module.exports = cards;
