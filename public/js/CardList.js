class CardList { // класс для хранения и отрисовки карточек
  constructor(container, cardInstance, api) { // принимает два аргумента: DOM-элемент - контейнер, куда нужно складывать карточки и массив карточек поумолчанию
    this.container = container;
    this.card = cardInstance;
    this.api = api;
  }

  addCard(name, link) { // для добавления карточки в список, принимает на вход экземпляр карточки;
    const cardElement = this.card.create(name, link);
    this.container.appendChild(cardElement);
  }

  render() { // для отрисовки карточек при загрузке страницы
    // Цепочка промисов ничего не возвращает, нет смысла ее переменной присваивать
    this.api.getInitialCards()
      .then((defaultCards) => {
        defaultCards.forEach((item) => {
          this.addCard(item.name, item.link);
        })
      })
      .catch((error) => {
        console.error(error);
        throw Error;
      })
  }
}


/*
.then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
*/