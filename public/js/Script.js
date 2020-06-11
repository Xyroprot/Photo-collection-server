// Api
const config = {
  baseUrl: 'https://praktikum.tk/cohort9',
  headers: {
    authorization: '9a39461d-79a5-4fa9-aab0-d66d1ab77053',
    'Content-Type': 'application/json'
  },
};
const api = new Api(config);

// плитка изображений
const card = new Card();
const placeList = new CardList(document.querySelector('.places-list'), card, api); // елемент, содержащий плитку добавляемых изображений

// форма добавления изображений на страницу
const popupCard = new Popup(document.querySelector('.popup_card')); // элемент, управляющий всплывающим окном добавления картинки
const form = document.forms.new; // форма добавления картинки
const addButton = document.querySelector('.user-info__button'); //кнопка добавление картинки

// форма редактирования данных о пользователе
const popupProfile = new Popup(document.querySelector('.popup_profile')); // элемент, управляющий всплывающим окном изменения профиля
const formProfile = document.forms.profile; // форма редактирования профиля
const name = document.querySelector('.user-info__name'); // элемент, содержащий имя пользователя
const job = document.querySelector('.user-info__job'); // элемент, содержащий род его деятельности
const avatar = document.querySelector('.user-info__photo'); // элемент, содержащий аватар пользователя
const userInfo = new UserInfo(name.textContent, job.textContent, avatar, api); // // элемент, сохраняющий данные о пользователе по умолчанию
const editButton = document.querySelector('.user-info__edit-button'); //конпка редактирования профиля

// лайтбокс
const popupImage = document.querySelector('.places-list');

// Тут async ни к чему
async function editCardForm(event) { // функция, которая получает данные и отчищает форму
  event.preventDefault();
  placeList.addCard(form.elements.name.value, form.elements.link.value);
  popupCard.toggle();
  form.reset();
  //form.removeEventListener('submit', editCardForm);
}

function callCardMethods() { // функция добавляет обработчик событий элементу form;
  form.addEventListener('submit', editCardForm);
}

async function editProfileForm(event) { // функция реадктирует информацию о пользователе
  event.preventDefault();
  const payload = {
    name: formProfile.elements.person.value,
    about: formProfile.elements.about.value
  };
  // Можно лучше (почти надо исправить)
  // Вообще можно было не заморачиваясь с async/await вернуть сюда промис и через then и catch логику раскидать
  // Не совсем корректно реализовано, попап хоть и не закрывается при потере сети, но и обработкой ошибки я это
  // назвать не могу
  await userInfo.uploadUserInfo(payload);
  popupProfile.toggle();
  userInfo.setUserInfo(formProfile.elements.person.value, formProfile.elements.about.value);
  event.target.removeEventListener('submit', editProfileForm);
}

function callProfileMethods() { // функция заполняет поля формы по умполчанию и добавляет им обработчик событий;
  formProfile.addEventListener('submit', editProfileForm);
}

function lightBox(event) { // функция проверяет элемент, на котором произошло событие и запускает функцию конструктор для зума картинки
  if (event.target.className === "place-card__image") {
    new PopupLightBox(event.target, document.querySelector('.popup_image'));
  }
}

placeList.render();
userInfo.defaultUserInfo();
callCardMethods();
callProfileMethods();

popupImage.addEventListener('click', lightBox); // открытие лайтбокса

addButton.addEventListener('click', popupCard.toggle.bind(popupCard), new FormValidator(document.querySelector('.popup_card'))); // открытие формы добавления картинки при нажатии на кнопку addButton и запуск валидации полей

editButton.addEventListener('click', popupProfile.toggle.bind(popupProfile), new FormValidator(document.querySelector('.popup_profile'))); // открытие формы изменения профиля при нажатии на кнопку editButton и запуск валидации полей