import {TemplateClasses} from "../const.js";
import AbstractView from "./abstract.js";

export default class Smart extends AbstractView {
  constructor() {
    super();
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const currentScrollYPosition = this.getElement().scrollTop;
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    this.getElement().scrollTo(0, currentScrollYPosition);
    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }

  show() {
    this.getElement().classList.remove(TemplateClasses.HIDDEN);
  }

  hide() {
    this.getElement().classList.add(TemplateClasses.HIDDEN);
  }
}
