import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return `<a href="#${type}" data-filter-type=${type} class="main-navigation__item ${type === currentFilterType
    ? `main-navigation__item--active`
    : ``}">${name} ${type === `all` ? `` : `<span class="main-navigation__item-count">${count}</span>`}</a>`;

};

const createNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filterItem) => createFilterItemTemplate(filterItem, currentFilterType))
    .join(``);

  return `<nav class="main-navigation">
       <div class="main-navigation__items">
        ${filterItemsTemplate}
       </div>
       <a href="#stats" class="main-navigation__additional">Stats</a>
     </nav>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
