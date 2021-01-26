import Observer from "./observer.js";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting movie`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          name: film.film_info.title,
          originalName: film.film_info.alternative_title,
          poster: film.film_info.poster,
          rating: film.film_info.total_rating,
          director: film.film_info.director,
          writers: film.film_info.writers,
          actors: film.film_info.actors,
          filmDate: film.film_info.release.date,
          filmDuration: film.film_info.runtime,
          genres: film.film_info.genre,
          description: film.film_info.description,
          country: film.film_info.release.release_country,
          age: film.film_info.age_rating,
          isWatchlist: film.user_details.watchlist,
          isWatched: film.user_details.already_watched,
          watchedData: film.user_details.watching_date,
          isFavorite: film.user_details.favorite,
        }
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;
    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "film_info": {
            "title": film.name,
            "alternative_title": film.originalName,
            "poster": film.poster,
            "total_rating": film.rating,
            "director": film.director,
            "writers": film.writers,
            "actors": film.actors,
            "runtime": film.filmDuration,
            "age_rating": film.age,
            "genre": film.genres,
            "description": film.description,
            "release": {
              "date": film.filmDate,
              "release_country": film.country
            }
          },
          "user_details": {
            "watchlist": film.isWatchlist,
            "already_watched": film.isWatched,
            "watching_date": film.watchedData,
            "favorite": film.isFavorite
          }
        }
    );

    delete adaptedFilm.name;
    delete adaptedFilm.originalName;
    delete adaptedFilm.poster;
    delete adaptedFilm.rating;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.filmDate;
    delete adaptedFilm.filmDuration;
    delete adaptedFilm.genres;
    delete adaptedFilm.description;
    delete adaptedFilm.country;
    delete adaptedFilm.age;
    delete adaptedFilm.isWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.watchedData;
    delete adaptedFilm.isFavorite;

    return adaptedFilm;
  }
}
