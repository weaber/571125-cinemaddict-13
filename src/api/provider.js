import FilmsModel from "../model/films.js";
import {toast} from "../utils/toast.js";

const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSyncRequired = false;
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  isSyncRequired() {
    return this._isSyncRequired;
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());
    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  getComments(filmId) {
    if (this._isOnline()) {
      return this._api.getComments(filmId);
    }

    toast(`You can't get comments offline`);
    return Promise.resolve([]);
  }

  addComment(filmId, comment) {
    if (this._isOnline()) {
      return this._api.addComment(filmId, comment);
    }

    toast(`You can't add comment offline`);
    return Promise.reject(new Error(`Add comment failed`));
  }

  deleteComment(commentId) {
    if (this._isOnline()) {
      return this._api.deleteComment(commentId);
    }

    toast(`You can't delete comment offline`);
    return Promise.reject(new Error(`Delete comment failed`));
  }

  updateFilm(film) {
    if (this._isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));
    this._isSyncRequired = true;
    return Promise.resolve(film);
  }

  sync() {
    if (this._isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);
          const items = createStoreStructure([...updatedFilms]);
          this._store.setItems(items);
          this._isSyncRequired = false;
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
