const users = require('express').Router();
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const filePath = path.resolve('data', 'users.json');

const sendUsers = (async (req, res) => {
  try {
    const fileReader = await fs.createReadStream(filePath, { encoding: 'utf8' });
    return fileReader.pipe(res.type('json'));
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Произошла ошибка при чтении данных' });
  }
});

const sendUserById = (async (req, res, next) => {
  fsPromises.readFile(filePath, { encoding: 'utf8' })
    .then((data) => {
      const usersData = JSON.parse(data);
      // eslint-disable-next-line no-underscore-dangle
      const userData = usersData.find((item) => item._id === req.params.id);
      if (userData) {
        res.send(userData);
      }
      res.status(404).send({ message: 'Нет пользователя с таким id' });
    })
    .catch(() => next(new Error('Произошла ошибка при чтении данных')));
});

users.get('/users', sendUsers);
users.get('/users/:id', sendUserById);

module.exports = users;
