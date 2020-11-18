import {createUserProfileTemplate} from "./view/user-profile.js";
import {createNavigationTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/menu.js";
import {createFilmsTemplate} from "./view/content-containers.js";
import {createFilmsListTemplate} from "./view/content-containers.js";
import {createTopratedTemplate} from "./view/content-containers.js";
import {createMostCommentedTemplate} from "./view/content-containers.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createShowmoreButtonTemplate} from "./view/showmore-button.js";
import {createFooterStatisticsTemplate} from "./view/footer-statistics.js";
// import {createPopupTemplate} from "./view/popup.js";

const FILM_CARD_AMOUNT = 5;
const TOPRATED_CARD_AMOUNT = 2;
const MOSTCOMMENTED_CARD_AMOUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, createUserProfileTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createNavigationTemplate(), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createFilmsTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);
render(filmsElement, createFilmsListTemplate(), `beforeend`);

const filmsListElement = filmsElement.querySelector(`.films-list`);
render(filmsListElement, createShowmoreButtonTemplate(), `beforeend`);

const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);
for (let i = 0; i < FILM_CARD_AMOUNT; i++) {
  render(filmsListContainerElement, createFilmCardTemplate(), `beforeend`);
}

render(filmsElement, createTopratedTemplate(), `beforeend`);
const topratedContainerElement = filmsElement.querySelector(`.toprated`).querySelector(`.films-list__container`);
for (let i = 0; i < TOPRATED_CARD_AMOUNT; i++) {
  render(topratedContainerElement, createFilmCardTemplate(), `beforeend`);
}

render(filmsElement, createMostCommentedTemplate(), `beforeend`);
const mostCommentedContainerElement = filmsElement.querySelector(`.mostcommented`).querySelector(`.films-list__container`);
for (let i = 0; i < MOSTCOMMENTED_CARD_AMOUNT; i++) {
  render(mostCommentedContainerElement, createFilmCardTemplate(), `beforeend`);
}

const footerStatisitcsElement = document.querySelector(`.footer__statistics`);
render(footerStatisitcsElement, createFooterStatisticsTemplate(), `beforeend`);

// Закомментил рендер попапа, чтоб он всю страницу не перекрывал
// render(siteMainElement, createPopupTemplate(), `afterend`);
