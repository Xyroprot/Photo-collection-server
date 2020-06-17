const users = require('express').Router();

const { getUsers, getUserById, createUser } = require('../controllers/users');

users.get('/users', getUsers); // возвращает всех пользователей
users.get('/users/:userId', getUserById); // возвращает пользователя по _id
users.post('/users', createUser); // создаёт пользователя

module.exports = users;
