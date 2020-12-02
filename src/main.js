import UserProfileView from "./view/user-profile.js";
import MenuView from "./view/menu.js";
import SortView from "./view/sort.js";
import FilmsContentView from "./view/films-content-container.js";
import MainFilmsListContentView from "./view/main-films-list.js";
import FilmsListView from "./view/films-list-container.js";
import TopratedView from "./view/toprated.js";
import MostCommentedView from "./view/mostcommented.js";
import FilmCardView from "./view/film-card.js";
import ShowmoreButtonView from "./view/showmore-button.js";
import FooterStatsView from "./view/footer-statistics.js";
import {generateFilm} from "./mock/film.js";
import {getRandomInt} from "./utils.js";
import {generateFilters} from "./mock/filter.js";
import PopupView from "./view/popup.js";
import {renderElement, RenderPosition} from "./utils.js";

const bodyElement = document.querySelector(`body`);
const FILMS_AMOUNT = 23;

const FILMS_AMOUNT_PER_STEP = 5;
const TOPRATED_CARD_AMOUNT = 2;
const MOSTCOMMENTED_CARD_AMOUNT = 2;

const films = new Array(FILMS_AMOUNT).fill().map(generateFilm);
const filters = generateFilters(films);

const watchedFilmsAmount = getRandomInt(0, FILMS_AMOUNT);

const renderCard = (filmsListElement, film) => {
  const cardComponent = new FilmCardView(film);
  const popupComponent = new PopupView(film);

  const cardPosterElement = cardComponent.getElement().querySelector(`.film-card__poster`);
  const cardTitleElement = cardComponent.getElement().querySelector(`.film-card__title`);
  const cardCommentsAmountElement = cardComponent.getElement().querySelector(`.film-card__comments`);
  const popupCloseElement = popupComponent.getElement().querySelector(`.film-details__close-btn`);

  const showPopup = () => {
    bodyElement.appendChild(popupComponent.getElement());
  };

  const closePopup = () => {
    bodyElement.removeChild(popupComponent.getElement());
  };

  cardPosterElement.addEventListener(`click`, showPopup);
  cardTitleElement.addEventListener(`click`, showPopup);
  cardCommentsAmountElement.addEventListener(`click`, showPopup);
  popupCloseElement.addEventListener(`click`, closePopup);

  renderElement(filmsListElement, cardComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteHeaderElement = document.querySelector(`.header`);
renderElement(siteHeaderElement, new UserProfileView(watchedFilmsAmount).getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);
renderElement(siteMainElement, new MenuView(filters).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);

const FilmsComponent = new FilmsContentView();
renderElement(siteMainElement, FilmsComponent.getElement(), RenderPosition.BEFOREEND);

const mainFilmsListComponent = new MainFilmsListContentView();
renderElement(FilmsComponent.getElement(), mainFilmsListComponent.getElement(), RenderPosition.BEFOREEND);

const FilmsListComponent = new FilmsListView();
renderElement(mainFilmsListComponent.getElement(), FilmsListComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < Math.min(FILMS_AMOUNT_PER_STEP, FILMS_AMOUNT); i++) {
  renderCard(FilmsListComponent.getElement(), films[i]);
}

if (films.length > FILMS_AMOUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_AMOUNT_PER_STEP;
  const ShowmoreButtonComponent = new ShowmoreButtonView();
  renderElement(mainFilmsListComponent.getElement(), ShowmoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  ShowmoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_AMOUNT_PER_STEP)
      .forEach((film) => renderCard(FilmsListComponent.getElement(), film));

    renderedFilmsCount += FILMS_AMOUNT_PER_STEP;

    if (renderedFilmsCount >= FILMS_AMOUNT) {
      ShowmoreButtonComponent.getElement().remove();
      ShowmoreButtonComponent.removeElement();
    }
  });
}

const TopratedFilmsListComponent = new TopratedView();
renderElement(FilmsComponent.getElement(), TopratedFilmsListComponent.getElement(), RenderPosition.BEFOREEND);
const TopratedList = new FilmsListView();
renderElement(TopratedFilmsListComponent.getElement(), TopratedList.getElement(), RenderPosition.BEFOREEND);
for (let i = 0; i < TOPRATED_CARD_AMOUNT; i++) {
  renderCard(TopratedList.getElement(), films[i]);
}

const MostCommentedFilmsListComponent = new MostCommentedView();
renderElement(FilmsComponent.getElement(), MostCommentedFilmsListComponent.getElement(), RenderPosition.BEFOREEND);
const MostCommentedList = new FilmsListView();
renderElement(MostCommentedFilmsListComponent.getElement(), MostCommentedList.getElement(), RenderPosition.BEFOREEND);
for (let i = 0; i < MOSTCOMMENTED_CARD_AMOUNT; i++) {
  renderCard(MostCommentedList.getElement(), films[i]);
}

const footerStatisitcsElement = document.querySelector(`.footer__statistics`);
renderElement(footerStatisitcsElement, new FooterStatsView(films).getElement(), RenderPosition.BEFOREEND);
