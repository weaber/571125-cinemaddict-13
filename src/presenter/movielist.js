import SortView from "../view/sort.js";
import FilmsContentView from "../view/films-content-container.js";
import MainFilmsListContentView from "../view/main-films-list.js";
import NoFilmsView from "../view/no-films.js";
import FilmsListView from "../view/films-list-container.js";
import TopRatedView from "../view/toprated.js";
import MostCommentedView from "../view/mostcommented.js";
import ShowMoreButtonView from "../view/showmore-button.js";
import MovieCardPresenter from "./movie.js";
import {render, RenderPosition, remove} from "../utils/render.js";
// import {updateItem} from "../utils/utils.js";
import {SortType} from "../const.js";
import {sortByDate, sortByRating} from "../utils/utils.js";


const FILMS_AMOUNT_PER_STEP = 5;

export default class MovieList {
  constructor(mainContainer, filmsModel) {
    this._filmsModel = filmsModel;
    this._mainContainer = mainContainer;
    this._renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;

    this._cardPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsContentView();
    this._mainFilmsListComponent = new MainFilmsListContentView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    // this._handleCardChange = this._handleCardChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._topRatedComponent = new TopRatedView();
    this._topRatedFilmsListComponent = new FilmsListView();

    this._mostCommentedComponent = new MostCommentedView();
    this._mostCommentedFilmsListComponent = new FilmsListView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortByDate);
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(sortByRating);
      // default:
        // return this._filmsModel.getFilms().slice();
    }

    return this._filmsModel.getFilms();
  }

  init() {
    this._renderSort();
    render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    this._renderMainContent();
  }

  _renderCard(film) {
    const cardPresenter = new MovieCardPresenter(this._filmsListComponent, this._handleViewAction, this._handleModeChange);
    cardPresenter.init(film);
    this._cardPresenter[film.id] = cardPresenter;
  }

  _handleModeChange() {
    Object
      .values(this._cardPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  // _handleCardChange(updatedCard) {
  //   // this._films = updateItem(this._films, updatedCard);
  //   // Здесь будем вызывать обновление модели
  //   this._cardPresenter[updatedCard.id].init(updatedCard);
  // }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  }

  _clearCardList() {
    Object
      .values(this._cardPresenter)
      .forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};
    this._renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderCards(films) {
    films.forEach((film) => this._renderCard(film));
  }

  _handleShowMoreButtonClick() {
    const filmsAmount = this._getFilms().length;
    const newRenderedFilmsAmount = Math.min(filmsAmount, this._renderedFilmsAmount + FILMS_AMOUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsAmount, newRenderedFilmsAmount);

    this._renderCards(films);
    this._renderedFilmsAmount = newRenderedFilmsAmount;

    if (this._renderedFilmsAmount >= filmsAmount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._mainFilmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
  }

  _renderSort() {
    if (this._getFilms().length === 0) {
      return;
    }
    render(this._mainContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoFilms() {
    render(this._filmsComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderTopRated() {
    const MAX_TOPRATED_CARD_AMOUNT = 2;
    let topratedCardAmount = Math.min(MAX_TOPRATED_CARD_AMOUNT, this._films.length);

    render(this._filmsComponent, this._topRatedComponent, RenderPosition.BEFOREEND);
    render(this._topRatedComponent, this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < topratedCardAmount; i++) {
      const TopRatedPresenter = new MovieCardPresenter(this._topRatedFilmsListComponent);
      TopRatedPresenter.init(this._films[i]);
    }
  }

  _renderMostCommented() {
    const MAX_MOSTCOMMENTED_CARD_AMOUNT = 2;
    let mostCommentedCardAmount = Math.min(MAX_MOSTCOMMENTED_CARD_AMOUNT, this._films.length);
    render(this._filmsComponent, this._mostCommentedComponent, RenderPosition.BEFOREEND);
    render(this._mostCommentedComponent, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < mostCommentedCardAmount; i++) {
      const MostCommentedPresenter = new MovieCardPresenter(this._mostCommentedFilmsListComponent);
      MostCommentedPresenter.init(this._films[i]);
    }
  }

  _renderFilmsList() {
    const filmsAmount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsAmount, FILMS_AMOUNT_PER_STEP));

    this._renderCards(films);

    if (filmsAmount > FILMS_AMOUNT_PER_STEP) {
      this._renderShowMoreButton();
    }

  }

  _renderMainContent() {
    if (this._getFilms().length === 0) {
      this._renderNoFilms();
      return;
    }

    render(this._filmsComponent, this._mainFilmsListComponent, RenderPosition.BEFOREEND);
    render(this._mainFilmsListComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderFilmsList();

    // this._renderTopRated();
    // this._renderMostCommented();
  }
}
