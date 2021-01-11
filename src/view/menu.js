import AbstractView from "./abstract.js";
// import {MenuItem} from "../const.js";

const createMenuTemplate = () => {
  return `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};

export default class Menu extends AbstractView {
  // constructor() {
  //   super();

  //   this._menuClickHandler = this._menuClickHandler.bind(this);
  // }

  getTemplate() {
    return createMenuTemplate();
  }

  // _menuClickHandler(evt) {
  //   evt.preventDefault();
  //   this._callback.menuClick(evt.target.value);
  // }

  // setMenuClickHandler(callback) {
  //   this._callback.menuClick = callback;
  //   this.getElement().addEventListener(`change`, this._menuClickHandler);
  // }

  // setMenuItem(menuItem) {
  //   const item = this.getElement().querySelector(`[value=${menuItem}]`);

  //   if (item !== null) {
  //     item.checked = true;
  //   }
  // }

}
