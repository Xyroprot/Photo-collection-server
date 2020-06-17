const users = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

users.get('/users', getUsers); // возвращает всех пользователей
users.get('/users/:userId', getUserById); // возвращает пользователя по _id
users.post('/users', createUser); // создаёт пользователя
users.patch('/users/me', updateProfile); // обновляет профиль
users.patch('/users/me/avatar', updateAvatar); // обновляет аватар

module.exports = users;
