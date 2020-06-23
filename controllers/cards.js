const Card = require('../models/card');
const {
  NotFoundError,
  BadRequesError,
  ForbiddenError,
} = require('../errors/errors-bundle');

const getCards = (async (req, res, next) => {
  await Card.find({})
    .orFail(new NotFoundError('Карточки не найдены'))
    .then((cards) => res.send({ data: cards }))
    .catch(next);
});

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      next(error);
    });
};

const deleteCard = (async (req, res, next) => {
  await Card.findById(req.params.cardId)
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
        next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      next(error);
    });
});

const likeCard = (async (req, res, next) => {
  await Card.findByIdAndUpdate(
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
        next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      next(error);
    });
});

const dislikeCard = (async (req, res, next) => {
  await Card.findByIdAndUpdate(
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
        next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      next(error);
    });
});

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
