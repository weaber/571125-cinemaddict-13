import Observer from "./observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = {};
  }

  setComments(comments) {
    this._comments = comments;
  }

  getComments() {
    return this._comments;
  }

  deleteComment(updateType, commentId) {

  }

  addComment(update) {
    this._comments[update.id] = update;
    this._notify(update);
  }
}
