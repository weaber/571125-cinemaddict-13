import AbstractView from "./abstract.js";

const createShowmoreButtonTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowButton extends AbstractView {
  getTemplate() {
    return createShowmoreButtonTemplate();
  }
}
