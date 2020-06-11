class UserInfo { //класс для работы с данными пользователя
  constructor(name, about, avatar, api) {
    this.name = name;
    this.about = about;
    this.avatar = avatar;
    this.api = api;
  }

  updateUserInfo(name, about) { // отображает данные на странице и загружает данные на сервер
    document.querySelector('.user-info__name').textContent = name;
    document.querySelector('.user-info__job').textContent = about;
  }

  setUserInfo(name, about) { // обновляет данные внутри экземпляра класса
    this.name = name;
    this.about = about;
    this.updateUserInfo(name, about);
  }

  async uploadUserInfo(payload) {
    await this.api.saveUserInfo(payload);
  }

  defaultUserInfo() { // загрузка данных о пользователе по умолчанию
    this.api.getUserInfo()
      .then((defaultInfo) => {
        this.updateUserInfo(defaultInfo.name, defaultInfo.about);
        this.avatar.style = "background-image: url(" + defaultInfo.avatar + ")";
      })
      .catch((error) => {
        console.error(error);
        throw Error;
      });
  }
}



