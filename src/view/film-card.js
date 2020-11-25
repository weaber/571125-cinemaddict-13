import dayjs from "dayjs";

export const createFilmCardTemplate = (film) => {
  const {name, poster, description, rating, date, duration, genres, comments, isWatchlist, isWatched, isFavorite} = film;
  const year = dayjs(date).format(`YYYY`);
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

  return `
    <article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
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
