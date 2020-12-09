import FilmCardView from "../view/film-card.js";
import PopupView from "../view/popup.js";
import {render, RenderPosition} from "../utils/render.js";

export default class Movie {
  constructor(movieListContainer) {
    this._bodyElement = document.querySelector(`body`);
    this._movieListContainer = movieListContainer;

    this._cardComponent = null;
    this._popupComponent = null;

    this._showPopup = this._showPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._popupEscPressHandler = this._popupEscPressHandler.bind(this);
  }

  init(film) {
    this._film = film;

    this._cardComponent = new FilmCardView(film);
    this._popupComponent = new PopupView(film);

    this._cardComponent.setPosterClickHandler(this._showPopup);
    this._cardComponent.setTitleClickHandler(this._showPopup);
    this._cardComponent.setCommentsClickHandler(this._showPopup);
    this._popupComponent.setCloseClickHandler(this._closePopup);

    render(this._movieListContainer, this._cardComponent, RenderPosition.BEFOREEND);
  }

  _showPopup() {
    this._bodyElement.appendChild(this._popupComponent.getElement());
    document.addEventListener(`keydown`, this._popupEscPressHandler);
  }

  _closePopup() {
    this._bodyElement.removeChild(this._popupComponent.getElement());
    document.removeEventListener(`keydown`, this._popupEscPressHandler);
  }

  _popupEscPressHandler(evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener(`keydown`, this._popupEscPressHandler);
    }
  }

}
