import AbstractView from "./abstract.js";

const createUserProfileTemplate = (amount) => {
  let userTitle = ``;
  // Не нравится мне пока что такое количество else if

  if (amount >= 21) {
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

export default class UserProfile extends AbstractView {
  constructor(amount) {
    super();
    this._amount = amount;
  }

  getTemplate() {
    return createUserProfileTemplate(this._amount);
  }
}
