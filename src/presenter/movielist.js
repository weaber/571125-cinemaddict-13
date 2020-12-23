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
import {updateItem} from "../utils/utils.js";
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

    this._handleCardChange = this._handleCardChange.bind(this);

    this._topRatedComponent = new TopRatedView();
    this._topRatedFilmsListComponent = new FilmsListView();

    this._mostCommentedComponent = new MostCommentedView();
    this._mostCommentedFilmsListComponent = new FilmsListView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  _getFilms() {
    return this._filmsModel.getFilms();
  }

  init(films) {
    this._films = films.slice();
    this._sourceFilms = films.slice();
    this._renderSort();
    render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    this._renderMainContent(films);
  }

  _renderCard(film) {
    const cardPresenter = new MovieCardPresenter(this._filmsListComponent, this._handleCardChange, this._handleModeChange);
    cardPresenter.init(film);
    this._cardPresenter[film.id] = cardPresenter;
  }

  _handleModeChange() {
    Object
      .values(this._cardPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleCardChange(updatedCard) {
    this._films = updateItem(this._films, updatedCard);
    this._cardPresenter[updatedCard.id].init(updatedCard);
  }

  _clearCardList() {
    Object
      .values(this._cardPresenter)
      .forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};
    this._renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderCards(from, to) {
    this._films
    .slice(from, to)
    .forEach((film) => this._renderCard(film));
  }

  _handleShowMoreButtonClick() {
    this._renderCards(this._renderedFilmsAmount, this._renderedFilmsAmount + FILMS_AMOUNT_PER_STEP);
    this._renderedFilmsAmount += FILMS_AMOUNT_PER_STEP;
    if (this._renderedFilmsAmount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._mainFilmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortByDate);
        break;
      case SortType.RATING:
        this._films.sort(sortByRating);
        break;
      default:
        this._films = this._sourceFilms.slice();
    }

    this._currentSortType = sortType;
    // - Очищаем список
    this._clearCardList();
    // - Рендерим список заново
    this._renderCards(0, Math.min(this._films.length, FILMS_AMOUNT_PER_STEP));

    if (this._films.length > FILMS_AMOUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortFilms(sortType);
  }

  _renderSort() {
    if (this._films.length === 0) {
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

  _renderMainContent() {
    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    }

    render(this._filmsComponent, this._mainFilmsListComponent, RenderPosition.BEFOREEND);
    render(this._mainFilmsListComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderCards(0, Math.min(this._films.length, FILMS_AMOUNT_PER_STEP));

    if (this._films.length > FILMS_AMOUNT_PER_STEP) {
      this._renderShowMoreButton();
    }

    this._renderTopRated();
    this._renderMostCommented();
  }
}
