const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: { // ссылка на аватарку
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: { // ссылка на картинку
    type: String,
    validate: [validator.isURL, 'Здесь должна быть ссылка в формате: http://mysite.ru'],
    required: true,
  },
  owner: { // ссылка на модель автора карточки
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: { // список лайкнувших пост пользователей
    type: [].push(mongoose.Schema.Types.ObjectId),
    default: [],
  },
  createdAt: { // дата создания
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
