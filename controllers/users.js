const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const {
  NotFoundError,
  BadRequesError,
  ConflictingRequestError,
} = require('../errors/errors-bundle');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (async (req, res, next) => {
  await User.findById(req.params.userId)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      next(error);
    });
});

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => {
      res.status(201).send({
        name, about, avatar, email,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError' || !password) {
        next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      if (error.name === 'MongoError' && error.code === 11000) {
        next(new ConflictingRequestError('Указанный email уже используется'));
      }
      next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredencials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secreWord',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
        .end();
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
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
        next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      next(error);
    });
};

const updateAvatar = (req, res, next) => {
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
        next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      next(error);
    });
};

module.exports = {
  getUsers,
  getUserById,
  login,
  createUser,
  updateProfile,
  updateAvatar,
};
