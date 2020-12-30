import Observer from "./observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments() {

  }

  getComments() {
    return this._comments;
  }

  deleteComment(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);
    if (index === -1) {
      throw new Error(`Can't delete unexisting movie`);
    }
    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];
    this._notify(updateType, update);
  }

  addComment() {

  }
}
