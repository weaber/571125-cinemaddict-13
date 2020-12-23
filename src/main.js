import FilmsModel from "./model/movies.js";

import UserProfileView from "./view/user-profile.js";
import MenuView from "./view/menu.js";
import FooterStatsView from "./view/footer-statistics.js";

import MovieListPresenter from "./presenter/movielist.js";

import {generateFilm} from "./mock/film.js";
import {generateFilters} from "./mock/filter.js";
import {getRandomInt} from "./utils/utils.js";
import {render, RenderPosition} from "./utils/render.js";

const FILMS_AMOUNT = getRandomInt(0, 23);
const films = new Array(FILMS_AMOUNT).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filters = generateFilters(films);
const watchedFilmsAmount = getRandomInt(0, films.length);

const siteHeaderElement = document.querySelector(`.header`);
if (films.length > 0 && watchedFilmsAmount > 0) {
  render(siteHeaderElement, new UserProfileView(watchedFilmsAmount), RenderPosition.BEFOREEND);
}

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, new MenuView(filters), RenderPosition.BEFOREEND);

const movieListPresenter = new MovieListPresenter(siteMainElement, filmsModel);
movieListPresenter.init();

const footerStatisitcsElement = document.querySelector(`.footer__statistics`);
render(footerStatisitcsElement, new FooterStatsView(films), RenderPosition.BEFOREEND);
