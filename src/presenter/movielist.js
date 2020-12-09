import SortView from "../view/sort.js";
import FilmsContentView from "../view/films-content-container.js";
import MainFilmsListContentView from "../view/main-films-list.js";
import NoFilmsView from "../view/no-films.js";
import FilmsListView from "../view/films-list-container.js";
import FilmCardView from "../view/film-card.js";
import TopRatedView from "../view/toprated.js";
import MostCommentedView from "../view/mostcommented.js";

import ShowMoreButtonView from "../view/showmore-button.js";
import PopupView from "../view/popup.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const FILMS_AMOUNT_PER_STEP = 5;

export default class MovieList {
  constructor(mainContainer) {
    this._mainContainer = mainContainer;
    this._renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;

    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsContentView();
    this._mainFilmsListComponent = new MainFilmsListContentView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._topRatedComponent = new TopRatedView();
    this._topRatedFilmsListComponent = new FilmsListView();

    this._mostCommentedComponent = new MostCommentedView();
    this._mostCommentedFilmsListComponent = new FilmsListView();
  }

  init(films) {
    this._films = films.slice();
    this._renderSort();
    render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    this._renderMainContent(films);
  }

  _renderCard(list, film) {
    const bodyElement = document.querySelector(`body`);
    const cardComponent = new FilmCardView(film);

    const showPopup = () => {
      const popupComponent = new PopupView(film);

      const closePopup = () => {
        popupComponent.getElement().remove();
        bodyElement.removeChild(popupComponent.getElement());
        document.removeEventListener(`keydown`, popupEscPressHandler);
      };

      const popupEscPressHandler = (evt) => {
        if (evt.key === `Escape`) {
          evt.preventDefault();
          closePopup();
          document.removeEventListener(`keydown`, popupEscPressHandler);
        }
      };

      popupComponent.setCloseClickHandler(closePopup);
      bodyElement.appendChild(popupComponent.getElement());
      document.addEventListener(`keydown`, popupEscPressHandler);
    };

    cardComponent.setPosterClickHandler(showPopup);
    cardComponent.setTitleClickHandler(showPopup);
    cardComponent.setCommentsClickHandler(showPopup);

    render(list, cardComponent, RenderPosition.BEFOREEND);
  }

  _renderCards(from, to) {
    this._films
    .slice(from, to)
    .forEach((film) => this._renderCard(this._filmsListComponent, film));
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

  _renderSort() {
    if (this._films.length > 0) {
      render(this._mainContainer, this._sortComponent, RenderPosition.BEFOREEND);
    }
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
      this._renderCard(this._topRatedFilmsListComponent, this._films[i]);
    }
  }

  _renderMostCommented() {
    const MAX_MOSTCOMMENTED_CARD_AMOUNT = 2;
    let mostCommentedCardAmount = Math.min(MAX_MOSTCOMMENTED_CARD_AMOUNT, this._films.length);
    render(this._filmsComponent, this._mostCommentedComponent, RenderPosition.BEFOREEND);
    render(this._mostCommentedComponent, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);
    for (let i = 0; i < mostCommentedCardAmount; i++) {
      this._renderCard(this._mostCommentedFilmsListComponent, this._films[i]);
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
