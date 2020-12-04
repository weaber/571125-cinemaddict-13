import AbstractView from "./abstract.js";

export const createMainFilmsListTemplate = () => {
  return `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  </section>
  `;
};

export default class MainFilmsListContent extends AbstractView {
  getTemplate() {
    return createMainFilmsListTemplate();
  }
}
