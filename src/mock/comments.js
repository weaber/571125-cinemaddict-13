import {generateName, generateDate, generateId} from "./film.js";
import {getRandomInt} from "../utils/utils.js";

const FILM_DESCRIPTION = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const EMOTIONS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

export const comments = {};

const addComment = (filmId, comment) => {
  if (!comments[filmId]) {
    comments[filmId] = [];
  }

  comments[filmId].push(comment);
};

export const getComments = (filmId) => {
  return comments[filmId] || [];
};

export const generateComment = (filmId) => {
  const generateText = () => FILM_DESCRIPTION[getRandomInt(FILM_DESCRIPTION.length - 1)];
  const generateEmotion = () => EMOTIONS[getRandomInt(EMOTIONS.length - 1)];

  const comment = {
    id: generateId(),
    text: generateText(),
    emotion: generateEmotion(),
    date: generateDate(30, `days`),
    author: generateName()
  };

  addComment(filmId, comment);
  return comment.id;
};

export const deleteComment = (filmId, commentId) => {
  comments[filmId] = comments[filmId]
    .filter((currentComment) => currentComment.id !== +commentId);
};
