class Card { // класс, создающий карточку и добавляющий ее элементам обработчики событий
  constructor(name, link) {
    this.cardElement = this.create(name, link);
  }

  create(nameValue, linkValue) { //  создаtn DOM-элемент карточки
    const placeCard = document.createElement('div');
    placeCard.classList.add('place-card');

    const cardImage = document.createElement('div');
    cardImage.classList.add('place-card__image');
    cardImage.style = "background-image: url(" + linkValue + ")";
    cardImage.dataset.url = linkValue;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('place-card__delete-icon');

    const cardDescription = document.createElement('div');
    cardDescription.classList.add('place-card__description');

    const cardName = document.createElement('h3');
    cardName.classList.add('place-card__name');
    cardName.textContent = nameValue;

    const likeButton = document.createElement('button');
    likeButton.classList.add('place-card__like-icon');

    cardImage.appendChild(deleteButton);
    cardDescription.appendChild(cardName);
    cardDescription.appendChild(likeButton);
    placeCard.appendChild(cardImage);
    placeCard.appendChild(cardDescription);
    this.eventListeners(placeCard);

    return placeCard;
  }

  like(event) { // ставит/убирает "лайк" для карточки
    event.target.classList.toggle('place-card__like-icon_liked');
  }

  remove(event) { // удаляет добавленную карточку
    const placeCard = event.target.closest('.place-card');
    event.target.closest('.places-list').removeChild(placeCard);
  }

  eventListeners(placeCard) { // добавляет обработчики событий элементам карточки
    placeCard
      .querySelector('.place-card__like-icon')
      .addEventListener('click', this.like);
    placeCard
      .querySelector('.place-card__delete-icon')
      .addEventListener('click', this.remove);
  }
}