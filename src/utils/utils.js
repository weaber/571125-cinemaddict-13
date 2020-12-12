import dayjs from "dayjs";

export const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
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
  const weight = getWeightForNullDate(filmA.date, filmB.date);

  if (weight !== null) {
    return weight;
  }

  return dayjs(filmA.date).diff(dayjs(filmB.date));
};

export const sortByRating = (filmA, filmB) => {
  return filmA.rating - filmB.rating;
};
