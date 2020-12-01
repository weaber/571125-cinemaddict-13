import {createElement} from "../utils.js";

const createUserProfileTemplate = (amount) => {
  let userTitle = ``;
  // Не нравится мне пока что такое количество else if
  if (amount === 0) {
    return ``;
  } else if (amount >= 21) {
    userTitle = `Movie Buff`;
  } else if (amount <= 10) {
    userTitle = `Novice`;
  } else {
    userTitle = `Fan`;
  }

  return `<section class="header__profile profile">
    <p class="profile__rating">${userTitle}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
  `;
};

export default class UserProfile {
  constructor(amount) {
    this._amount = amount;
    this._element = null;
  }

  getTemplate() {
    return createUserProfileTemplate(this._amount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
