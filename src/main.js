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
import {render, RenderPosition, replace} from "./utils/render.js";
import {MenuItem, StatPeriodMap} from "./const.js";

const FILMS_AMOUNT = getRandomInt(0, 23);
const films = new Array(FILMS_AMOUNT).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filtersModel = new FiltersModel();

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const siteMenuComponent = new MenuView();
render(siteMainElement, siteMenuComponent, RenderPosition.BEFOREEND);

let statsComponent = null;
const siteNavigationElement = siteMainElement.querySelector(`.main-navigation`);

const userProfilePresenter = new UserProfilePresenter(siteHeaderElement, filmsModel);
const filtersPresenter = new FiltersPresenter(siteNavigationElement, filtersModel, filmsModel);
const movieListPresenter = new MovieListPresenter(siteMainElement, filmsModel, filtersModel);

const handleSiteMenuClick = (menuItem) => {
  if (menuItem !== MenuItem.STATS) {
    statsComponent.hide();
    movieListPresenter.show();
    return;
  }

  let prevStatsComponent = statsComponent;
  const watchedFilms = filmsModel.getFilms().filter((film) => film.isWatched);
  const currentUserTitle = userProfilePresenter.getCurrentUserTitle();
  statsComponent = new StatsView(watchedFilms, StatPeriodMap.ALL_TIME, currentUserTitle);
  if (prevStatsComponent === null) {
    movieListPresenter.hide();
    render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
    filtersPresenter.resetCurrentFilter();
    return;
  }

  replace(statsComponent, prevStatsComponent);

  movieListPresenter.hide();
  statsComponent.show();
  filtersPresenter.resetCurrentFilter();
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

userProfilePresenter.init();
filtersPresenter.init();
movieListPresenter.init();

const footerStatisitcsElement = document.querySelector(`.footer__statistics`);
render(footerStatisitcsElement, new FooterStatsView(films), RenderPosition.BEFOREEND);
