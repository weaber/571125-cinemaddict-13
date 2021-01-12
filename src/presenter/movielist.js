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
import {SortType, UserAction, UpdateType, TemplateClasses} from "../const.js";
import {filter, sortByDate, sortByRating} from "../utils/utils.js";

const FILMS_AMOUNT_PER_STEP = 5;

export default class MovieList {
  constructor(mainContainer, filmsModel, filtersModel) {
    this._showMoreButtonComponent = null;
    this._sortComponent = null;

    this._filmsModel = filmsModel;
    this._filtersModel = filtersModel;
    this._mainContainer = mainContainer;
    this._renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;

    this._cardPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._filmsComponent = new FilmsContentView();
    this._mainFilmsListComponent = new MainFilmsListContentView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._topRatedComponent = new TopRatedView();
    this._topRatedFilmsListComponent = new FilmsListView();

    this._mostCommentedComponent = new MostCommentedView();
    this._mostCommentedFilmsListComponent = new FilmsListView();

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
    this._filmsListComponent.getElement().classList.add(TemplateClasses.HIDDEN);
  }

  show() {
    this._sortComponent.getElement().classList.remove(`visually-hidden`);
    this._filmsListComponent.getElement().classList.remove(`visually-hidden`);
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

  _handleViewAction(actionType, updateType, update) {
    // console.log(`Клик View`);
    // console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // console.log(`Модель`);
    // console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
      // Перерисовываю конкретную карточку фильма (по клику на isWatched etc)
        this._cardPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
      // Тут пока про запас
        break;
      case UpdateType.MAJOR:
        this._clearMainContent({resetRenderedFilmsAmount: true, resetSortType: false});
        this._renderMainContent();
        break;
    }
  }

  _clearMainContent({resetRenderedFilmsAmount = false, resetSortType = false} = {}) {
    Object
      .values(this._cardPresenter)
      .forEach((presenter) => presenter.destroy());

    this._cardPresenter = {};
    remove(this._noFilmsComponent);
    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmsAmount) {
      this._renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
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
    // console.log(this._renderedFilmsAmount);
    this._clearMainContent({resetRenderedFilmsAmount: true});
    // console.log(this._renderedFilmsAmount);
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

    this._renderCards(films.slice(0, Math.min(filmsAmount, this._renderedFilmsAmount)));

    if (filmsAmount > this._renderedFilmsAmount) {
      this._renderShowMoreButton();
    }

    // this._renderTopRated();
    // this._renderMostCommented();
  }
}
