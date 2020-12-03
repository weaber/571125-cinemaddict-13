import dayjs from "dayjs";
import {getRandomInt} from "../utils.js";

const FILM_NAME = [
  `Made for each other`,
  `Popeye meets Sinbad`,
  `Sagebrush trail`,
  `Santa Claus conquers the martians`,
  `The dance of life`,
  `The great flamarion`,
  `The man with the golden arm`
];

const FILM_POSTER = [
  `./images/posters/made-for-each-other.png`,
  `./images/posters/popeye-meets-sinbad.png`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg`,
  `./images/posters/the-dance-of-life.jpg`,
  `./images/posters/the-great-flamarion.jpg`,
  `./images/posters/the-man-with-the-golden-arm.jpg`
];

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

const FILM_GENRES = [
  `Horror`,
  `Comedy`,
  `Thriller`,
  `Drama`,
  `Musical`
];

const FILM_NAMES = [
  `Steven Spielberg`,
  `Martin Scorsese`,
  `Alfred Hitchcock`,
  `Stanley Kubrick`,
  `Quentin Tarantino`,
  `Robert De Niro`,
  `Jack Nicholson`,
  `Tom Hanks`,
  `Leonardo DiCaprio`,
  `Grace Kelly`
];

const EMOTIONS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

const COUNTRIES = [
  `Russia`,
  `USA`,
  `Norway`
];

const generateDescription = () => {
  let AMOUNT = getRandomInt(1, 5);
  let filmDescription = ``;
  for (let i = 0; i < AMOUNT; i++) {
    filmDescription = filmDescription.concat(` ${FILM_DESCRIPTION[getRandomInt(FILM_DESCRIPTION.length - 1)]}`);
  }
  return filmDescription;
};

const generateFilmName = () => FILM_NAME[getRandomInt(FILM_NAME.length - 1)];
const generateFilmPoster = () => FILM_POSTER[getRandomInt(FILM_POSTER.length - 1)];
const generateRating = () => getRandomInt(0, 9) + getRandomInt(0, 10) / 10;
const generateDate = (ago, period) => dayjs().add(getRandomInt(-ago, 0), period);
const generateDuration = () => `${getRandomInt(0, 2)}h ${getRandomInt(0, 59)}m`;
const generateGenres = () => {
  let AMOUNT = getRandomInt(1, 3);
  let genres = [];
  for (let i = 0; i < AMOUNT; i++) {
    genres.push(FILM_GENRES[getRandomInt(FILM_GENRES.length - 1)]);
  }
  return genres;
};
const generateName = (amount) => {
  if (!amount) {
    amount = 1;
  }
  let names = [];
  for (let i = 0; i < amount; i++) {
    names.push(FILM_NAMES[getRandomInt(FILM_NAMES.length - 1)]);
  }
  return names;
};

const generateAge = () => `${getRandomInt(0, 18)}+`;
const generateCountry = () => COUNTRIES[getRandomInt(COUNTRIES.length - 1)];

const generateComments = () => {
  const AMOUNT = getRandomInt(0, 5);
  const generateComment = () => {
    const generateText = () => FILM_DESCRIPTION[getRandomInt(FILM_DESCRIPTION.length - 1)];
    const generateEmotion = () => EMOTIONS[getRandomInt(EMOTIONS.length - 1)];
    return {
      text: generateText(),
      emotion: generateEmotion(),
      author: generateName(),
      date: generateDate(30, `days`)
    };
  };

  const comments = new Array(AMOUNT).fill().map(generateComment);
  return comments;
};

export const generateFilm = () => {
  return {
    name: generateFilmName(),
    // originalName: ,
    poster: generateFilmPoster(),
    rating: generateRating(),
    director: generateName(),
    writers: generateName(getRandomInt(3)),
    actors: generateName(getRandomInt(3)),
    date: generateDate(80, `year`),
    duration: generateDuration(),
    genres: generateGenres(),
    description: generateDescription(),
    country: generateCountry(),
    age: generateAge(),
    isWatchlist: Boolean(getRandomInt(0, 1)),
    isWatched: Boolean(getRandomInt(0, 1)),
    isFavorite: Boolean(getRandomInt(0, 1)),
    comments: generateComments()
  };
};
