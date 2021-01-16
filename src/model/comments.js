import Observer from "./observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  deleteComment(updateType, commentId) {
    const index = this._comments.findIndex((comment) => comment.id === commentId);
    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];
    this._notify(updateType);
  }

  addComment(updateType, update) {
    this._comments = [
      ...this._comments,
      update
    ];

    this._notify(updateType);
  }

  static adaptToClient(comments) {
    const adaptedComment = Object.assign(
        {},
        comments,
        {
          text: comments.comment
        }
    );

    delete adaptedComment.comment;
    return adaptedComment;
  }

  static adaptToServer(comments) {
    const adaptedComment = Object.assign(
        {},
        comments,
        {
          comment: comments.text,
        }
    );

    delete adaptedComment.text;
    return adaptedComment;
  }
}
