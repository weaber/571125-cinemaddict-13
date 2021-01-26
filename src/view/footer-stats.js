import AbstractView from "./abstract.js";

const createFooterStatisticsTemplate = (films) => {
  return `<p>${films.length} movies inside</p>`;
};

export default class FooterStats extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._films);
  }
}

