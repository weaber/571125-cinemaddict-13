import FilmsModel from "./model/films.js";
import FiltersModel from "./model/filters.js";
import MenuView from "./view/menu.js";
import StatsView from "./view/stats.js";
import FooterStatsView from "./view/footer-stats.js";
import UserProfilePresenter from "./presenter/user-profile.js";
import MovieListPresenter from "./presenter/movie-list.js";
import FiltersPresenter from "./presenter/filters.js";
import {render, RenderPosition, replace} from "./utils/render.js";
import {MenuItem, StatPeriodMap, UpdateType} from "./const.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic fdgss;lfdg54655tty`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filmsModel = new FilmsModel();
const filtersModel = new FiltersModel();

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStatisitcsElement = document.querySelector(`.footer__statistics`);

const siteMenuComponent = new MenuView();
render(siteMainElement, siteMenuComponent, RenderPosition.BEFOREEND);

let statsComponent = null;
const siteNavigationElement = siteMainElement.querySelector(`.main-navigation`);

const userProfilePresenter = new UserProfilePresenter(siteHeaderElement, filmsModel);
const filtersPresenter = new FiltersPresenter(siteNavigationElement, filtersModel, filmsModel);
const movieListPresenter = new MovieListPresenter(siteMainElement, filmsModel, filtersModel, apiWithProvider);

const handleSiteMenuClick = (menuItem) => {
  if (menuItem !== MenuItem.STATS) {
    statsComponent.hide();
    movieListPresenter.show();
    return;
  }

  const prevStatsComponent = statsComponent;
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

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(footerStatisitcsElement, new FooterStatsView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    render(footerStatisitcsElement, new FooterStatsView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
  });

// window.addEventListener(`load`, () => {
//   navigator.serviceWorker.register(`./sw.js`);
// });

// window.addEventListener(`online`, () => {
//   document.title = document.title.replace(` [offline]`, ``);
//   if (apiWithProvider.isSyncRequired) {
//     apiWithProvider.sync();
//   }
// });

// window.addEventListener(`offline`, () => {
//   document.title += ` [offline]`;
// });
