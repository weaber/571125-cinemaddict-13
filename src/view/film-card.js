import AbstractView from "./abstract.js";
import dayjs from "dayjs";

import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const createFilmCardTemplate = (film) => {
  const {name, poster, description, rating, filmDate, filmDuration, genres, comments, isWatchlist, isWatched, isFavorite} = film;
  const year = dayjs(filmDate).format(`YYYY`);
  const isWatchlistClass = isWatchlist
    ? `film-card__controls-item--add-to-watchlist film-card__controls-item--active`
    : `film-card__controls-item--add-to-watchlist`;
  const isWatchedClass = isWatched
    ? `film-card__controls-item--mark-as-watched film-card__controls-item--active`
    : `film-card__controls-item--mark-as-watched`;
  const isFavoriteClass = isFavorite
    ? `film-card__controls-item--favorite film-card__controls-item--active`
    : `film-card__controls-item--favorite`;
  const commentsAmountSpan = (comments.length === 1)
    ? `${comments.length} comment`
    : `${comments.length} comments`;
  const cardDescription = (description.length > 140)
    ? `${description.slice(0, 139)}…`
    : `${description}`;
  const genre = genres[0];

  // у меня почему-то не работает эта запись, хотя в консоли на сайте day.js.org работает
  // const runtime = dayjs.duration(filmDuration, `minutes`).format(`H[h] mm[m]`);
  // Решил пока так
  const runtime = (filmDuration > 59) ? `${Math.floor(filmDuration / 60)}h ${filmDuration % 60}m` : `${filmDuration}m`;

  return `<article class="film-card">
    <h3 class="film-card__title">${name}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src=${poster} alt="" class="film-card__poster">
    <p class="film-card__description">${cardDescription}</p>
    <a class="film-card__comments">${commentsAmountSpan}</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button ${isWatchlistClass}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button ${isWatchedClass}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button ${isFavoriteClass}" type="button">Mark as favorite</button>
    </div>
  </article>
  `;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._posterClickHandler = this._posterClickHandler.bind(this);
    this._titleClickHandler = this._titleClickHandler.bind(this);
    this._commentsClickHandler = this._commentsClickHandler.bind(this);

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _posterClickHandler(evt) {
    evt.preventDefault();
    this._callback.posterClick();
  }

  _titleClickHandler(evt) {
    evt.preventDefault();
    this._callback.titleClick();
  }

  _commentsClickHandler(evt) {
    evt.preventDefault();
    this._callback.commentsClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setPosterClickHandler(callback) {
    this._callback.posterClick = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._posterClickHandler);
  }

  setTitleClickHandler(callback) {
    this._callback.titleClick = callback;
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._titleClickHandler);
  }

  setCommentsClickHandler(callback) {
    this._callback.commentsClick = callback;
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._commentsClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
