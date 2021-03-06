import FilmCardView from "../view/film-card.js";
import PopupView from "../view/popup.js";
import {remove, render, RenderPosition, replace} from "../utils/render.js";
import {UserAction, UpdateType, TemplateClasses} from "../const.js";
import CommentsModel from "../model/comments.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

export default class Movie {
  constructor(movieListContainer, changeData, changeMode, api, updateMostCommented) {
    this._updateMostCommented = updateMostCommented;
    this._api = api;
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
    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._commentsModel = new CommentsModel();
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init(film) {
    this._film = film;

    const prevCardComponent = this._cardComponent;

    this._cardComponent = new FilmCardView(this._film);
    this._cardComponent.setPosterClickHandler(this._showPopup);
    this._cardComponent.setTitleClickHandler(this._showPopup);
    this._cardComponent.setCommentsClickHandler(this._showPopup);
    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._cardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevCardComponent === null) {
      render(this._movieListContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._movieListContainer.getElement().contains(prevCardComponent.getElement())) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (this._mode === Mode.POPUP) {
      this._showPopup();
    }

    remove(prevCardComponent);
  }

  destroy() {
    remove(this._cardComponent);
    if (this._mode === Mode.DEFAULT) {
      remove(this._popupComponent);
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _showPopup() {
    if (this._mode !== Mode.POPUP) {
      this._changeMode();
    }
    this._mode = Mode.POPUP;
    const prevPopupComponent = this._popupComponent;

    this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);

        this._popupComponent = new PopupView(this._film, this._commentsModel.getComments());
        this._popupComponent.setCloseClickHandler(this._closePopup);
        this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
        this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
        this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
        this._popupComponent.setDeleteButtonClickHandler(this._handleDeleteButtonClick);
        this._popupComponent.restoreHandlers();

        if (prevPopupComponent !== null && this._bodyElement.contains(prevPopupComponent.getElement())) {
          const currentScrollYPosition = prevPopupComponent.getElement().scrollTop;
          replace(this._popupComponent, prevPopupComponent);
          this._popupComponent.getElement().scrollTo(0, currentScrollYPosition);
          this._bodyElement.classList.add(TemplateClasses.HIDE_OVERFLOW);
          document.addEventListener(`keydown`, this._formSubmitHandler);
          document.addEventListener(`keydown`, this._popupEscPressHandler);
        } else {
          render(this._bodyElement, this._popupComponent, RenderPosition.BEFOREEND);
          this._bodyElement.classList.add(TemplateClasses.HIDE_OVERFLOW);
          document.addEventListener(`keydown`, this._formSubmitHandler);
          document.addEventListener(`keydown`, this._popupEscPressHandler);
        }
      });
  }

  _closePopup() {
    this._mode = Mode.DEFAULT;
    remove(this._popupComponent);
    this._bodyElement.classList.remove(TemplateClasses.HIDE_OVERFLOW);
    document.removeEventListener(`keydown`, this._popupEscPressHandler);
    document.removeEventListener(`keydown`, this._formSubmitHandler);
    this._updateMostCommented();
  }

  _popupEscPressHandler(evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener(`keydown`, this._popupEscPressHandler);
      document.removeEventListener(`keydown`, this._formSubmitHandler);
    }
  }

  _handleDeleteButtonClick(commentId) {
    this._popupComponent.updateData({
      isDeleting: true,
      deletingCommentId: commentId
    });

    this._api.deleteComment(commentId)
      .then(
          () => {
            this._commentsModel.deleteComment(UserAction.DELETE_COMMENT, commentId);
          }
      )
      .catch(() => {
        this.setAborting();
      });
  }

  _formSubmitHandler(evt) {
    if (evt.ctrlKey && evt.key === `Enter`) {
      const localComment = this._popupComponent.getNewComment();
      if (localComment.emotion === `` || localComment.text === ``) {
        this.setAborting();
        return;
      }
      localComment.date = new Date();
      this._popupComponent.updateData({
        isDisabled: true
      });
      this._api.addComment(this._film.id, localComment)
        .then(
            (data) => {
              const newComment = data.comments[data.comments.length - 1];
              return this._commentsModel.addComment(UserAction.ADD_COMMENT, newComment);
            }
        )
        .catch(() => {
          this.setAborting();
        });
    }
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
              isWatched: !this._film.isWatched,
              watchedData: (!this._film.isWatched) ? new Date() : null
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
      case UserAction.DELETE_COMMENT:
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

      case UserAction.ADD_COMMENT:
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

  setAborting() {
    const resetPopupState = () => {
      this._popupComponent.updateData({isDisabled: false, deletingCommentId: null});
    };
    this._popupComponent.shake(resetPopupState);
  }
}
