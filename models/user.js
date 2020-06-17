const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { // имя пользователя
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: { // информация о пользователе
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: { // ссылка на аватарку
    type: String,
    validate: [validator.isURL, 'Здесь должна быть ссылка в формате: http://mysite.ru'],
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
