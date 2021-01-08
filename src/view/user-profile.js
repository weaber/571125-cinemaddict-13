import AbstractView from "./abstract.js";

const createUserProfileTemplate = (userTitle) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${userTitle}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
  `;
};

export default class UserProfile extends AbstractView {
  constructor(userTitle) {
    super();
    this._userTitle = userTitle;
  }

  getTemplate() {
    return createUserProfileTemplate(this._userTitle);
  }
}
