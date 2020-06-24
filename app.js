const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('validator');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();
const {
  celebrate, errors, Joi, Segments,
} = require('celebrate');

const cards = require('./routes/cards');
const users = require('./routes/users');

const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NotFoundError, BadRequesError } = require('./errors/errors-bundle');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const urlValidator = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.error(new BadRequesError('Произошла ошибка при обработке запроса'));
  }
  return value;
};

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().custom(urlValidator).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use('/', auth, cards);
app.use('/', auth, users);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err; // если у ошибки нет кода, то по умолчанию код "500"
  if (res.headersSent) {
    return next(err);
  }
  return res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'Произошла ошибка при чтении данных' : message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
