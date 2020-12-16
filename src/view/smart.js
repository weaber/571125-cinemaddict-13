import AbstractView from "./abstract.js";

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }
  // Это заготовка из учебного проекта
  // updateData(update, justDataUpdating) {
  //   if (!update) {
  //     return;
  //   }

  //   this._data = Object.assign(
  //       {},
  //       this._data,
  //       update
  //   );

  //   if (justDataUpdating) {
  //     return;
  //   }

  //   this.updateElement();
  // }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    console.log(`Апдейт!`);
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
