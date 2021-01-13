import UserProfileView from "../view/user-profile.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {UserTitleMap} from "../const.js";

export default class UserProfile {
  constructor(userProfileContainer, filmsModel) {
    this._userProfileContainer = userProfileContainer;
    this._filmsModel = filmsModel;

    this._userTitle = null;
    this._userProfileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._userTitle = this._getUserTitle();

    const prevUserProfileComponent = this._userProfileComponent;
    this._userProfileComponent = new UserProfileView(this._userTitle);

    if (prevUserProfileComponent === null) {
      render(this._userProfileContainer, this._userProfileComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._userProfileComponent, prevUserProfileComponent);
    remove(prevUserProfileComponent);
  }

  _getUserTitle() {
    const watchedFilmsAmount = this._filmsModel.getFilms().filter((film) => film.isWatched).length;
    if (watchedFilmsAmount === 0) {
      return ``;
    } else if (watchedFilmsAmount >= 21) {
      return UserTitleMap.MOVIE_BUFF;
    } else if (watchedFilmsAmount >= 10) {
      return UserTitleMap.FAN;
    } else {
      return UserTitleMap.NOVICE;
    }
  }

  _handleModelEvent() {
    this.init();
  }

  getCurrentUserTitle() {
    return this._userTitle;
  }
}
