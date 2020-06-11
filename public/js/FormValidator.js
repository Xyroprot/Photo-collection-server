class FormValidator { // класс для валидации полей формы
  constructor(popupElement) {
    this.setEventListeners(popupElement);
  }

  checkInputValidity(inputElement, errorElement) { // показывает ошибку, если инпуты не проходят валидацию.
    if (inputElement.validity.typeMismatch) {
      errorElement.textContent = "Здесь должна быть ссылка";
      return errorElement.textContent;
    }
    if (inputElement.validity.valueMissing) {
      errorElement.textContent = "Это обязательное поле";
      return errorElement.textContent;
    }
    if (inputElement.validity.tooLong || inputElement.validity.tooShort) {
      errorElement.textContent = "Должно быть от 2 до 30 символов";
      return errorElement.textContent;
    }
    errorElement.textContent = "";
    return errorElement.textContent;
  }

  setSubmitButtonState(form, button) { // делать кнопку сабмита активной или неактивной
    button.disabled = !form.checkValidity();
  }

  validate(event) { // функция вызывает в теле checkInputValidity и setSubmitButtonState для валидации заполняемой формы и активации кнопки submit
    const form = event.target.parentElement; // реадактируемая форма
    const submitButton = form.querySelector('.popup__button'); // кнопка подтверждения внесенных изменений
    this.checkInputValidity(event.target, event.target.nextElementSibling);
    this.setSubmitButtonState(form, submitButton);
  }

  setEventListeners(popup) { // добавляет необходимые для валидации обработчики всем полям формы
    const form = popup.querySelector('.popup__form'); // форма редактирования профиля
    form.addEventListener('input', this.validate.bind(this));
  }
}