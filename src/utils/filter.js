import {FilterType} from "../const.js";

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film.id),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isWatchlist),
};
