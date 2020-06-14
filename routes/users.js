const users = require('express').Router();
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const filePath = path.resolve('data', 'users.json');
// const fileReader = fs.createReadStream(filePath, { encoding: 'utf8' });

const sendUsers = (async (req, res, next) => {
  try {
    const fileReader = await fs.createReadStream(filePath, { encoding: 'utf8' });
    return fileReader.pipe(res);
  } catch (error) {
    // отправляет ошибку в обработчик
    return next(error);
  }
});

const usersServerError = (asyncHandler(async () => {
  throw new Error('Все сломалось... опять!');
}));

const sendUserById = (async (req, res, next) => {
  fsPromises.readFile(filePath, { encoding: 'utf8' })
    .then((data) => {
      // eslint-disable-next-line no-underscore-dangle
      const index = JSON.parse(data).findIndex((item) => item._id === req.params.id);
      if (index === -1) {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      res.send(JSON.parse(data)[index]);
    })
    .catch(() => next(new Error('Все сломалось... опять!')));
});

users.get('/users', sendUsers);
users.get('/users', usersServerError);
users.get('/users/:id', sendUserById);

/*
users.get('/users', (req, res) => {
  res.sendFile(filePath);
});
*/

module.exports = users;
