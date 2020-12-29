import dayjs from "dayjs";
import {FilterType} from "../const.js";

export const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getWeightForNullDate = (filmA, filmB) => {
  if (filmA === null && filmB === null) {
    return 0;
  }

  if (filmA === null) {
    return 1;
  }

  if (filmB === null) {
    return -1;
  }

  return null;
};

export const sortByDate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.filmDate, filmB.filmDate);

  if (weight !== null) {
    return weight;
  }

  return dayjs(filmA.filmDate).diff(dayjs(filmB.filmDate));
};

export const sortByRating = (filmA, filmB) => {
  return filmA.rating - filmB.rating;
};

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film.id),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};
