const bcrypt = require('bcryptjs');
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
    validate: validator.isURL,
    required: true,
  },
  email: { // адрес электорнной почты
    type: String,
    validate: validator.isEmail,
    required: true,
    unique: true,
  },
  password: { // пароль пользователя
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

userSchema.statics = function findUserByCredencials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
