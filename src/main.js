import FilmsModel from "./model/movies.js";
import FiltersModel from "./model/filters.js";

import MenuView from "./view/menu.js";
import StatsView from "./view/stats.js";
import FooterStatsView from "./view/footer-statistics.js";

import UserProfilePresenter from "./presenter/user-profile.js";
import MovieListPresenter from "./presenter/movielist.js";
import FiltersPresenter from "./presenter/filters.js";

import {generateFilm} from "./mock/film.js";
import {getRandomInt} from "./utils/utils.js";
import {render, RenderPosition} from "./utils/render.js";
import {MenuItem} from "./const.js";

const FILMS_AMOUNT = getRandomInt(0, 23);
const films = new Array(FILMS_AMOUNT).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filtersModel = new FiltersModel();

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const siteMenuComponent = new MenuView();
render(siteMainElement, siteMenuComponent, RenderPosition.BEFOREEND);

const siteNavigationElement = siteMainElement.querySelector(`.main-navigation`);

const userProfilePresenter = new UserProfilePresenter(siteHeaderElement, filmsModel);
const filtersPresenter = new FiltersPresenter(siteNavigationElement, filtersModel, filmsModel);
const movieListPresenter = new MovieListPresenter(siteMainElement, filmsModel, filtersModel);

const handleSiteMenuClick = (menuItem) => {
  if (menuItem === MenuItem.STATS) {
    movieListPresenter.hide();
    statsComponent.show();
    filtersPresenter.resetCurrentFilter();
    return;
  }
  statsComponent.hide();
  movieListPresenter.show();
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

userProfilePresenter.init();
filtersPresenter.init();
movieListPresenter.init();

const watchedFilms = filmsModel.getFilms().filter((film) => film.isWatched);
const statsComponent = new StatsView(watchedFilms);
render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
statsComponent.hide();

const footerStatisitcsElement = document.querySelector(`.footer__statistics`);
render(footerStatisitcsElement, new FooterStatsView(films), RenderPosition.BEFOREEND);
