const users = require('express').Router();
const validator = require('validator');
const {
  celebrate, Joi, errors, Segments,
} = require('celebrate');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const { BadRequesError } = require('../errors/errors-bundle');

const urlValidator = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.error(new BadRequesError('Произошла ошибка при обработке запроса'));
  }
  return value;
};

users.get('/users', celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), getUsers); // возвращает всех пользователей

users.get('/users/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), getUserById); // возвращает пользователя по _id

users.patch('/users/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), updateProfile); // обновляет профиль

users.patch('/users/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().custom(urlValidator).required(),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), updateAvatar); // обновляет аватар

users.use(errors());

module.exports = users;
