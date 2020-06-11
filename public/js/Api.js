class Api {
  constructor(config) {
    this.config = config;
  }

  getUserInfo() { // загрузка информации о пользователе с сервера
    return this._request('/users/me', 'GET', this.config.headers);
  }


  getInitialCards() { // загрузка первоначальных карточек с сервера
    return this._request('/cards', 'GET', this.config.headers);
  }


  saveUserInfo(payload) { // редактирование профиля
    return this._request('/users/me', 'PATCH', this.config.headers, payload);
  }

  _request(url, method, header, payload) { // модель запроса
    return fetch(this.config.baseUrl + url, {
      method,
      headers: header,
      body: payload ? JSON.stringify(payload) : undefined,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })

      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
        throw Error;
      })
  }
}
