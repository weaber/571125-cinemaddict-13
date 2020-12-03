import {createElement} from "../utils.js";
// Понимаю, что это криво, но пока хоть так... в лоб
const createNavigationTemplate = (filters) => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filters[0].count}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filters[1].count}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filters[2].count}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
  `;
};


export default class Menu {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createNavigationTemplate(this._filters);
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
