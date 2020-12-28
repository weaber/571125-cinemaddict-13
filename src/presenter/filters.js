import FiltersView from "../view/filters.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {FilterType} from "../const.js";

export default class Filters {
  constructor(filtersContainer, filtersModel, filmsModel) {
    this._filtersContainer = filtersContainer;
    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;

    this._currentFilter = null;
    this._filtersComponent = null;

    // this._handleModelEvent = this._handleModelEvent.bind(this);
    // this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    // this._filmsModel.addObserver(this._handleModelEvent);
    // this._filtersModel.addObserver(this._handleFilterTypeChange);
  }

  init() {
    this._currentFilter = this._filtersModel.getFilter();

    const filters = this._getFilters();
    const prevFiltersComponent = this._filtersComponent;

    this._filtersComponent = new FiltersView(filters, this._currentFilter);
    // this._filtersComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFiltersComponent === null) {
      render(this._filtersContainer, this._filtersComponent, RenderPosition.BEFOREEND);
      return;
    }
    console.log(filters);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();
    return [
      {
        type: `all`,
        name: `All movies`,
        count: films.length
      },
      {
        type: `watchlist`,
        name: `Watchlist`,
        count: films.filter((film) => film.isWatchlist).length
      },
      {
        type: `history`,
        name: `History`,
        count: films.filter((film) => film.isWatched).length
      },
      {
        type: `favorites`,
        name: `Favorites`,
        count: films.filter((film) => film.isFavorite).length
      }
    ];
  }
}
