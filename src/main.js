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
import {generateFilm} from "./mock/film.js";
import {getRandomInt} from "./mock/film.js";
import {generateFilters} from "./mock/filter.js";
import {createPopupTemplate} from "./view/popup.js";

const FILMS_AMOUNT = 24;

const FILMS_AMOUNT_PER_STEP = 5;
const TOPRATED_CARD_AMOUNT = 2;
const MOSTCOMMENTED_CARD_AMOUNT = 2;

const films = new Array(FILMS_AMOUNT).fill().map(generateFilm);
const filters = generateFilters(films);
// console.log(films[0]);
// console.log(filters);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const watchedFilmsAmount = getRandomInt(0, FILMS_AMOUNT);

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, createUserProfileTemplate(watchedFilmsAmount), `beforeend`);

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createNavigationTemplate(filters), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createFilmsTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);
render(filmsElement, createFilmsListTemplate(), `beforeend`);

const filmsListElement = filmsElement.querySelector(`.films-list`);

const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);
for (let i = 0; i < Math.min(FILMS_AMOUNT_PER_STEP, FILMS_AMOUNT); i++) {
  render(filmsListContainerElement, createFilmCardTemplate(films[i]), `beforeend`);
}

if (films.length > FILMS_AMOUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_AMOUNT_PER_STEP;

  render(filmsListElement, createShowmoreButtonTemplate(), `beforeend`);
  const showMoreButton = filmsListElement.querySelector(`.films-list__show-more`);
  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_AMOUNT_PER_STEP)
      .forEach((film) => render(filmsListContainerElement, createFilmCardTemplate(film), `beforeend`));

    renderedFilmsCount += FILMS_AMOUNT_PER_STEP;

    if (renderedFilmsCount >= FILMS_AMOUNT) {
      showMoreButton.remove();
    }
  });
}

render(filmsElement, createTopratedTemplate(), `beforeend`);
const topratedContainerElement = filmsElement.querySelector(`.toprated`).querySelector(`.films-list__container`);
for (let i = 0; i < TOPRATED_CARD_AMOUNT; i++) {
  render(topratedContainerElement, createFilmCardTemplate(films[i]), `beforeend`);
}

render(filmsElement, createMostCommentedTemplate(), `beforeend`);
const mostCommentedContainerElement = filmsElement.querySelector(`.mostcommented`).querySelector(`.films-list__container`);
for (let i = 0; i < MOSTCOMMENTED_CARD_AMOUNT; i++) {
  render(mostCommentedContainerElement, createFilmCardTemplate(films[i]), `beforeend`);
}

const footerStatisitcsElement = document.querySelector(`.footer__statistics`);
render(footerStatisitcsElement, createFooterStatisticsTemplate(films), `beforeend`);

render(siteMainElement, createPopupTemplate(films[0]), `afterend`);
