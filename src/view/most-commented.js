import AbstractView from "./abstract.js";

const createMostCommentedTemplate = () => {
  return `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most Commented</h2>
  </section>
  `;
};

export default class MostCommented extends AbstractView {
  getTemplate() {
    return createMostCommentedTemplate();
  }
}
