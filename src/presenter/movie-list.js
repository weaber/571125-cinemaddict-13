import SortView from "../view/sort.js";
import FilmsContentView from "../view/films-content.js";
import MainFilmsListView from "../view/main-films-list.js";
import LoadingView from "../view/loading.js";
import NoFilmsView from "../view/no-films.js";
import FilmsListView from "../view/films-list.js";
import TopRatedView from "../view/top-rated.js";
import MostCommentedView from "../view/most-commented.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import MovieCardPresenter from "./movie.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {SortType, UserAction, UpdateType, TemplateClasses} from "../const.js";
import {filter, sortByDate, sortByRating, sortByComments} from "../utils/utils.js";

const FILMS_AMOUNT_PER_STEP = 5;

export default class MovieList {
  constructor(mainContainer, filmsModel, filtersModel, api) {
    this._showMoreButtonComponent = null;
    this._sortComponent = null;
    this._api = api;

    this._filmsModel = filmsModel;
    this._filtersModel = filtersModel;
    this._mainContainer = mainContainer;
    this._renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;

    this._cardPresenter = {
      mainList: {},
      topRatedList: {},
      mostCommentedList: {}
    };
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._filmsComponent = new FilmsContentView();
    this._mainFilmsListComponent = new MainFilmsListView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();
    this._loadingComponent = new LoadingView();

    this._topRatedComponent = new TopRatedView();
    this._topRatedFilmsListComponent = new FilmsListView();

    this._mostCommentedComponent = new MostCommentedView();
    this._mostCommentedFilmsListComponent = new FilmsListView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filtersModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  init() {
    this._renderMainContent();
  }

  hide() {
    this._sortComponent.getElement().classList.add(TemplateClasses.HIDDEN);
    this._filmsComponent.getElement().classList.add(TemplateClasses.HIDDEN);
  }

  show() {
    this._sortComponent.getElement().classList.remove(`visually-hidden`);
    this._filmsComponent.getElement().classList.remove(`visually-hidden`);
  }

  _renderCard(film, container, cardPresenterList) {
    const cardPresenter = new MovieCardPresenter(container, this._handleViewAction, this._handleModeChange, this._api);
    cardPresenter.init(film);
    cardPresenterList[film.id] = cardPresenter;
  }

  _handleModeChange() {
    Object
      .values(this._cardPresenter.mainList)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // Обновляем доску
        if (this._cardPresenter.mainList[data.id]) {
          this._cardPresenter.mainList[data.id].init(data);
        }
        // Тут нужно просто обновить topRated
        if (this._cardPresenter.topRatedList[data.id]) {
          this._cardPresenter.topRatedList[data.id].init(data);
        }
        // Тут нужно будет и обновить (клик по Watchlist etc) и перерисовать (если изменилось количество комментариев) mostCommented
        if (this._cardPresenter.mostCommentedList[data.id]) {
          this._cardPresenter.mostCommentedList[data.id].init(data);
          break;
        }
        // И тут проблема, если меняется количество комментариев и составл блока, тогда надо перерисовать блок, но оставить попап.
        break;
      case UpdateType.MAJOR:
        this._clearMainContent({resetRenderedFilmsAmount: true, resetSortType: true});
        this._clearTopRated();
        this._clearMostCommented();
        this._renderMainContent();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderMainContent();
        break;
    }
  }

  _renderLoading() {
    render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._mainFilmsListComponent, RenderPosition.BEFOREEND);
    render(this._mainFilmsListComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _clearMainContent({resetRenderedFilmsAmount = false, resetSortType = false} = {}) {
    Object
      .values(this._cardPresenter.mainList)
      .forEach((presenter) => presenter.destroy());

    this._cardPresenter.mainList = {};

    remove(this._noFilmsComponent);
    remove(this._sortComponent);
    remove(this._loadingComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmsAmount) {
      this._renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderCards(films, container, cardPresenterList) {
    films.forEach((film) => this._renderCard(film, container, cardPresenterList));
  }

  _handleShowMoreButtonClick() {
    const filmsAmount = this._getFilms().length;
    const newRenderedFilmsAmount = Math.min(filmsAmount, this._renderedFilmsAmount + FILMS_AMOUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsAmount, newRenderedFilmsAmount);

    this._renderCards(films, this._filmsListComponent, this._cardPresenter.mainList);
    this._renderedFilmsAmount = newRenderedFilmsAmount;

    if (this._renderedFilmsAmount >= filmsAmount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    render(this._mainFilmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearMainContent({resetRenderedFilmsAmount: true});
    this._clearTopRated();
    this._clearMostCommented();
    this._renderMainContent();
  }

  _renderSortComponent() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._mainContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderNoFilms() {
    render(this._filmsComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderTopRated() {
    const MAX_TOPRATED_CARD_AMOUNT = 2;
    const films = this._getFilms();

    if (films.every((film) => film.rating === 0)) {
      return;
    }

    const topRatedCardAmount = Math.min(MAX_TOPRATED_CARD_AMOUNT, this._filmsModel.getFilms().length);
    const topRatedFilms = films.sort(sortByRating).slice(0, topRatedCardAmount);

    render(this._filmsComponent, this._topRatedComponent, RenderPosition.BEFOREEND);
    render(this._topRatedComponent, this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);

    this._renderCards(topRatedFilms, this._topRatedFilmsListComponent, this._cardPresenter.topRatedList);
  }

  _renderMostCommented() {
    const MAX_MOSTCOMMENTED_CARD_AMOUNT = 2;
    const films = this._getFilms();

    if (films.every((film) => film.comments === 0)) {
      return;
    }

    const mostCommentedCardAmount = Math.min(MAX_MOSTCOMMENTED_CARD_AMOUNT, this._filmsModel.getFilms().length);
    const mostCommentedFilms = films.sort(sortByComments).slice(0, mostCommentedCardAmount);

    render(this._filmsComponent, this._mostCommentedComponent, RenderPosition.BEFOREEND);
    render(this._mostCommentedComponent, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);

    this._renderCards(mostCommentedFilms, this._mostCommentedFilmsListComponent, this._cardPresenter.mostCommentedList);
  }

  _clearTopRated() {
    Object
    .values(this._cardPresenter.topRatedList)
    .forEach((presenter) => presenter.destroy());
    this._cardPresenter.topRatedList = {};
    remove(this._topRatedComponent);
  }

  _clearMostCommented() {
    Object
      .values(this._cardPresenter.mostCommentedList)
      .forEach((presenter) => presenter.destroy());
    this._cardPresenter.mostCommentedList = {};
    remove(this._mostCommentedComponent);
  }

  _renderMainContent() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmsAmount = films.length;

    if (filmsAmount === 0) {
      render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);
      this._renderNoFilms();
      return;
    }

    this._renderSortComponent();
    render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);

    render(this._filmsComponent, this._mainFilmsListComponent, RenderPosition.BEFOREEND);
    render(this._mainFilmsListComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderCards(films.slice(0, Math.min(filmsAmount, this._renderedFilmsAmount)), this._filmsListComponent, this._cardPresenter.mainList);

    if (filmsAmount > this._renderedFilmsAmount) {
      this._renderShowMoreButton();
    }

    this._renderTopRated();
    this._renderMostCommented();
  }
}
