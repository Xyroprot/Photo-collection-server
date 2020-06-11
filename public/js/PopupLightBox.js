class PopupLightBox extends Popup {
  constructor(image, popup) {
    super(popup);
    this.image = image;
    popup.querySelector('.popup__picture').src = image.dataset.url;
    this.toggle(popup);
  }
}
