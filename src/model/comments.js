import Observer from "./observer.js";

export default class Comments extends Observer {
  constructor(film) {
    super();
    this._film = film;
  }

  getComments() {
    return this._film.comments;
  }
}
