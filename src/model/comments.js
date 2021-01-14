import Observer from "./observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
    console.log(this._comments);
  }

  getComments() {
    console.log(this._comments);
    return this._comments;
  }

  deleteComment(updateType, commentId) {
    const index = this._comments.findIndex((comment) => comment.id === +commentId);

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
    // console.log(comments);
    const adaptedComment = Object.assign(
        {},
        comments,
        {
          text: comments.comment
        }
    );

    delete adaptedComment.comment;

    // console.log(adaptedComment);
    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {}
    );

    return adaptedComment;
  }
}
