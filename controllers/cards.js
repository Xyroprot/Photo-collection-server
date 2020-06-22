const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        return res.status(404).send({ message: 'Ресурс не найден' });
      }
      return res.send({ data: cards });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при чтении данных' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при чтении данных' }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      if (card.owner !== req.user._id) {
        return res.status(403).send({ message: 'Это не ваша карточка' });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при чтении данных' }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при чтении данных' }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при чтении данных' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
