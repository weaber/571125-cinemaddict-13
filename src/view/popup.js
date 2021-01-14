import SmartView from "./smart.js";
import he from "he";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const BLANK_COMMENT = {
  text: ``,
  newEmotion: ``
};

const createFilmDetailsInfoTemplate = (data) => {
  const {
    poster,
    age,
    name,
    originalName,
    description,
    rating,
    director,
    writers,
    actors,
    filmDate,
    filmDuration,
    country,
    genres
  } = data;

  const releaseDate = dayjs(filmDate).format(`DD MMMM YYYY`);
  const runtime = (filmDuration > 59) ? `${Math.floor(filmDuration / 60)}h ${filmDuration % 60}m` : `${filmDuration}m`;

  const genresForm = (genres.length === 1) ? `Genre` : `Genres`;

  const createGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;
  const genresTemplate = genres.map(createGenreTemplate).join(``);

  return `<div class="film-details__poster">
  <img class="film-details__poster-img" src=${poster} alt="">

  <p class="film-details__age">${age}</p>
</div>

<div class="film-details__info">
  <div class="film-details__info-head">
    <div class="film-details__title-wrap">
      <h3 class="film-details__title">${name}</h3>
      <p class="film-details__title-original">Original: ${originalName}</p>
    </div>

    <div class="film-details__rating">
      <p class="film-details__total-rating">${rating}</p>
    </div>
  </div>

  <table class="film-details__table">
    <tr class="film-details__row">
      <td class="film-details__term">Director</td>
      <td class="film-details__cell">${director}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Writers</td>
      <td class="film-details__cell">${writers.join(`, `)}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Actors</td>
      <td class="film-details__cell">${actors.join(`, `)}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Release Date</td>
      <td class="film-details__cell">${releaseDate}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Runtime</td>
      <td class="film-details__cell">${runtime}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Country</td>
      <td class="film-details__cell">${country}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">${genresForm}</td>
      <td class="film-details__cell">
        ${genresTemplate}
      </td>
    </tr>
  </table>

  <p class="film-details__film-description">
    ${description}
  </p>
</div>`;

};

const createFilmDetailsControlsTemplate = (data) => {
  const {
    isWatchlist,
    isWatched,
    isFavorite
  } = data;

  const isCheckedClass = (property) => property ? `checked` : ``;

  return `<input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isCheckedClass(isWatchlist)}>
  <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

  <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isCheckedClass(isWatched)}>
  <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

  <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isCheckedClass(isFavorite)}>
  <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
  `;
};

const EmotionPicsMap = {
  smile: `./images/emoji/smile.png`,
  sleeping: `./images/emoji/sleeping.png`,
  puke: `./images/emoji/puke.png`,
  angry: `./images/emoji/angry.png`
};

const createCommentTemplate = (comment) => {
  const {id, emotion, author, date, text} = comment;

  return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src=${EmotionPicsMap[emotion]} width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(text)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
          <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
        </p>
      </div>
    </li>`;
};

const createCommentsTemplate = (comments) => {
  const commentListTemplate = comments
    .slice()
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
    .map(createCommentTemplate)
    .join(`\n`);
  return commentListTemplate;
};

const createNewCommentTemplate = (localComment) => {
  const {
    text,
    newEmotion
  } = localComment;

  const newEmojiPicture = (newEmotion) ? `<img src=${EmotionPicsMap[newEmotion]} width="55" height="55" alt="emoji-${newEmotion}">` : ``;

  return `<div class="film-details__add-emoji-label">${newEmojiPicture}</div>

  <label class="film-details__comment-label">
    <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${text}</textarea>
  </label>

  <div class="film-details__emoji-list">
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
    <label class="film-details__emoji-label" for="emoji-smile">
      <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
    <label class="film-details__emoji-label" for="emoji-sleeping">
      <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
    <label class="film-details__emoji-label" for="emoji-puke">
      <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
    <label class="film-details__emoji-label" for="emoji-angry">
      <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
    </label>
  </div>`;

};

const createPopupTemplate = (data, commentsCollection, localComment) => {
  const {
    comments
  } = data;

  const filmDetailsInfoTemplate = createFilmDetailsInfoTemplate(data);
  const filmDetailsControlsTemplate = createFilmDetailsControlsTemplate(data);
  const commentsTemplate = createCommentsTemplate(commentsCollection);
  const newCommentTemplate = createNewCommentTemplate(localComment);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          ${filmDetailsInfoTemplate}
        </div>

        <section class="film-details__controls">
          ${filmDetailsControlsTemplate}
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">${commentsTemplate}</ul>

          <div class="film-details__new-comment">
            ${newCommentTemplate}
          </div>
        </section>
      </div>
    </form>
  </section>
  `;
};

export default class Popup extends SmartView {
  constructor(film, commentsCollection) {
    super();
    this._data = film;
    this._commentsCollection = commentsCollection;

    this._localComment = BLANK_COMMENT;

    this._closeClickHandler = this._closeClickHandler.bind(this);

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._newCommentTextInputHandler = this._newCommentTextInputHandler.bind(this);

    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._data, this._commentsCollection, this._localComment);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeClickHandler);
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteButtonClick(evt.target.dataset.commentId);
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

  setDeleteButtonClickHandler(callback) {
    this._callback.deleteButtonClick = callback;
    let commentsDeleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    commentsDeleteButtons.forEach((comment) => comment.addEventListener(`click`, this._deleteButtonClickHandler));
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    this._localComment = Object.assign(
        {},
        this._localComment,
        {
          newEmotion: evt.target.value,
        }
    );
    let currentScrollYPosition = this.getElement().scrollTop;

    this.updateData(this._localComment);
    this.getElement().scrollTo(0, currentScrollYPosition);
  }

  _newCommentTextInputHandler(evt) {
    evt.preventDefault();
    this._localComment = Object.assign(
        {},
        this._localComment,
        {
          text: evt.target.value,
        }
    );
  }

  getNewComment() {
    return this._localComment;
  }

  _setInnerHandlers() {
    let emojies = this.getElement().querySelectorAll(`.film-details__emoji-item`);
    emojies.forEach((emoji) => emoji.addEventListener(`click`, this._emojiClickHandler));
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._newCommentTextInputHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);

    this.setDeleteButtonClickHandler(this._callback.deleteButtonClick);
  }
}
