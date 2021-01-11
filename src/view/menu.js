import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const ACTIVE_CLASS = `main-navigation__additional--active`;

const createMenuTemplate = () => {
  return `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional" data-type=${MenuItem.STATS}>Stats</a>
</nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    const statsButton = this.getElement().querySelector(`[data-type="${MenuItem.STATS}"]`);
    const isActive = statsButton.classList.contains(ACTIVE_CLASS);

    if (evt.target.dataset.type === MenuItem.STATS && isActive) {
      return;
    }

    if (evt.target.dataset.type !== MenuItem.STATS && !isActive) {
      return;
    }

    statsButton.classList.toggle(ACTIVE_CLASS);

    this._callback.menuClick(evt.target.dataset.type);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  // setMenuItem(menuItem) {
  //   const item = this.getElement().querySelector(`[value=${menuItem}]`);

  //   if (item !== null) {
  //     item.checked = true;
  //   }
  // }

}
