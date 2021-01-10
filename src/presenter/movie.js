import FilmCardView from "../view/film-card.js";
import PopupView from "../view/popup.js";
import {remove, render, RenderPosition, replace} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";
import CommentsModel from "../model/comments.js";
import {getComments, deleteComment, comments} from "../mock/comments.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

const page = document.querySelector(`body`);

export default class Movie {
  constructor(movieListContainer, changeData, changeMode) {
    this._bodyElement = document.querySelector(`body`);
    this._movieListContainer = movieListContainer;

    this._changeData = changeData;
    this._changeMode = changeMode;

    this._cardComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._showPopup = this._showPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._popupEscPressHandler = this._popupEscPressHandler.bind(this);

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._commentsModel = new CommentsModel();
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init(film) {
    // debugger;
    this._film = film;

    const prevCardComponent = this._cardComponent;
    const prevPopupComponent = this._popupComponent;

    this._cardComponent = new FilmCardView(this._film);
    this._commentsModel.setComments(getComments(this._film.id));

    console.log(this._film);
    console.log(this._commentsModel.getComments());

    this._popupComponent = new PopupView(this._film, this._commentsModel.getComments());

    this._popupComponent.setCloseClickHandler(this._closePopup);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setDeleteButtonClickHandler(this._handleDeleteButtonClick);
    this._popupComponent.restoreHandlers();


    this._cardComponent.setPosterClickHandler(this._showPopup);
    this._cardComponent.setTitleClickHandler(this._showPopup);
    this._cardComponent.setCommentsClickHandler(this._showPopup);
    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._cardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevCardComponent === null || prevPopupComponent === null) {
      render(this._movieListContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._movieListContainer.getElement().contains(prevCardComponent.getElement())) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (page.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevPopupComponent);
    remove(prevCardComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._popupComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _showPopup() {
    this._changeMode();
    this._mode = Mode.POPUP;

    render(this._bodyElement, this._popupComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._popupEscPressHandler);
  }

  _closePopup() {
    this._mode = Mode.DEFAULT;
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._popupEscPressHandler);
  }

  _popupEscPressHandler(evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener(`keydown`, this._popupEscPressHandler);
    }
  }

  _handleDeleteButtonClick(commentId) {
    // console.log(commentId);
    deleteComment(this._film.id, commentId);
    this._commentsModel.delete(UserAction.DELETE_COMMENT, commentId);
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isWatchlist: !this._film.isWatchlist
            }
        )
    );
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handleModelEvent(userAction) {
    switch (userAction) {
      case UserAction.DELETE_COMMENT: {
        this._changeData(
            UserAction.UPDATE_FILM,
            UpdateType.PATCH,
            Object.assign(
                {},
                this._film,
                {
                  comments: this._commentsModel.getComments().map((item) => item.id)
                }
            )
        );
        break;
      }
    }
  }

}
