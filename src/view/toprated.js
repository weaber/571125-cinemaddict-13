import AbstractView from "./abstract.js";

const createTopratedTemplate = () => {
  return `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
  </section>
  `;
};

export default class Toprated extends AbstractView {
  getTemplate() {
    return createTopratedTemplate();
  }
}
