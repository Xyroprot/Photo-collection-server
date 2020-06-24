const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/user');

const secretWord = crypto.randomBytes(32).toString('hex'); // секретный ключ для проверки токена

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при чтении данных' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(400).send({ message: 'Произошла ошибка при обработке запроса' });
      }
      return res.status(500).send({ message: 'Произошла ошибка при чтении данных' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({ _id: user._id, email: user.email });
    })
    .catch((error) => {
      if (error.name === 'ValidationError'
          || error.name === 'CastError'
          || error.message === 'Illegal arguments: undefined, number') {
        return res.status(400).send({ message: 'Произошла ошибка при обработке запроса' });
      }
      if (error.name === 'MongoError' && error.code === 11000) {
        return res.status(409).send({ message: 'Указанный email уже используется' });
      }
      return res.status(500).send({ message: 'Произошла ошибка при чтении данных' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredencials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        secretWord,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
        .end();
    })
    .catch(() => res.status(401).send({ message: 'Произошла ошибка аутентификации' }));
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name: `${name}`, about: `${about}` },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(400).send({ message: 'Произошла ошибка при обработке запроса' });
      }
      return res.status(500).send({ message: 'Произошла ошибка при чтении данных' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar: `${avatar}` },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(400).send({ message: 'Произошла ошибка при обработке запроса' });
      }
      return res.status(500).send({ message: 'Произошла ошибка при чтении данных' });
    });
};

module.exports = {
  secretWord,
  getUsers,
  getUserById,
  login,
  createUser,
  updateProfile,
  updateAvatar,
};
