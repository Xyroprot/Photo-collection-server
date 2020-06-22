const users = require('express').Router();

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

users.get('/users', getUsers); // возвращает всех пользователей
users.get('/users/:userId', getUserById); // возвращает пользователя по _id
users.patch('/users/me', updateProfile); // обновляет профиль
users.patch('/users/me/avatar', updateAvatar); // обновляет аватар

module.exports = users;
