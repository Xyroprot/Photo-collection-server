class Popup { //класс для всплывающего окна
  constructor (popup) {
    this.popup = popup;
    this.eventClose(popup);
  }

  toggle() { // для инвертирования класса открытия всплывающего окна и валидации полей заполнения при их наличии
    this.popup.classList.toggle('popup_is-opened');
  }

  eventClose(popup) { // добавляет обработчик события на кнопку 'x' для всплывающего окна
    popup.querySelector('.popup__close').addEventListener('click', this.close.bind(this));
  }

  close(event) { // для закрытия всплывающего окна
    event.target.closest('.popup').classList.remove('popup_is-opened');
    event.target.closest('.popup__close').removeEventListener('click', this.close.bind(this));
  }
}
