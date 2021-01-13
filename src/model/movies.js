import Observer from "./observer.js";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
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
          // id: film.id,
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
          // comments:
        }
    );

    delete adaptedFilm.film_info.title;
    delete adaptedFilm.film_info.alternative_title;
    delete adaptedFilm.film_info.poster;
    delete adaptedFilm.film_info.total_rating;
    delete adaptedFilm.film_info.director;
    delete adaptedFilm.film_info.writers;
    delete adaptedFilm.film_info.actors;
    delete adaptedFilm.film_info.release.date;
    delete adaptedFilm.film_info.runtime;
    delete adaptedFilm.film_info.genre;
    delete adaptedFilm.film_info.description;
    delete adaptedFilm.film_info.release.release_country;
    delete adaptedFilm.film_info.age_rating;
    delete adaptedFilm.user_details.watchlist;
    delete adaptedFilm.user_details.already_watched;
    delete adaptedFilm.user_details.watching_date;
    delete adaptedFilm.user_details.favorite;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "film_info.title": film.name,
          "film_info.alternative_title": film.originalName,
          "film_info.poster": film.poster,
          "film_info.total_rating": film.rating,
          "film_info.director": film.director,
          "film_info.writers": film.writers,
          "film_info.actors": film.actors,
          "film_info.release.date": film.filmDate,
          "film_info.runtime": film.filmDuration,
          "film_info.genre": film.genres,
          "film_info.description": film.description,
          "film_info.release.release_country": film.country,
          "film_info.age_rating": film.age,
          "user_details.watchlist": film.isWatchlist,
          "user_details.already_watched": film.isWatched,
          "user_details.watching_date": film.watchedData,
          "user_details.favorite": film.isFavorite

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
