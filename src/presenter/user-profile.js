import UserProfileView from "../view/user-profile.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {FilterType} from "../const.js";
import {filter} from "../utils/utils.js";

export default class UserProfile {
  constructor(userProfileContainer, filmsModel) {
    this._userProfileContainer = userProfileContainer;
    this._filmsModel = filmsModel;

    this._films = null;
    this._userProfileComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._films = this._filmsModel.getFilms();
    this._filmsAmount = filter[FilterType.HISTORY](this._films).length;
    const prevUserProfileComponent = this._userProfileComponent;

    this._userProfileComponent = new UserProfileView(this._filmsAmount);
    if (prevUserProfileComponent === null) {
      render(this._userProfileContainer, this._userProfileComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._userProfileComponent, prevUserProfileComponent);
    remove(prevUserProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
