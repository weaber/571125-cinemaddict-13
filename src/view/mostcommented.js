import {createElement} from "../utils.js";

const createMostCommentedTemplate = () => {
  return `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most Commented</h2>
  </section>
  `;
};

export default class MostCommented {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMostCommentedTemplate();
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
