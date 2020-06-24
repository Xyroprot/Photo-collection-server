const Card = require('../models/card');
const {
  NotFoundError,
  BadRequesError,
  ForbiddenError,
} = require('../errors/errors-bundle');

const getCards = (req, res, next) => {
  Card.find({})
    .orFail(new NotFoundError('Карточки не найдены'))
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      return next(error);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Это не ваша карточка');
      }
      return card.remove();
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      return next(error);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      return next(error);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      return next(error);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
