import AbstractView from "./abstract.js";

export const createFilmsListTemplate = () => {
  return `<div class="films-list__container"></div>`;
};

export default class FilmsList extends AbstractView {
  getTemplate() {
    return createFilmsListTemplate();
  }
}
