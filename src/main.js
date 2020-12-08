import UserProfileView from "./view/user-profile.js";
import MenuView from "./view/menu.js";
import SortView from "./view/sort.js";
import FilmsContentView from "./view/films-content-container.js";
import MainFilmsListContentView from "./view/main-films-list.js";
import NoFilmsView from "./view/no-films.js";
import FilmsListView from "./view/films-list-container.js";
import TopRatedView from "./view/toprated.js";
import MostCommentedView from "./view/mostcommented.js";
import FilmCardView from "./view/film-card.js";
import ShowmoreButtonView from "./view/showmore-button.js";
import FooterStatsView from "./view/footer-statistics.js";
import PopupView from "./view/popup.js";
import {generateFilm} from "./mock/film.js";
import {generateFilters} from "./mock/filter.js";
import {getRandomInt} from "./utils/utils.js";
import {renderElement, RenderPosition} from "./utils/render.js";

const bodyElement = document.querySelector(`body`);
const FILMS_AMOUNT = getRandomInt(0, 24);

const FILMS_AMOUNT_PER_STEP = 5;
const TOPRATED_CARD_AMOUNT = 2;
const MOSTCOMMENTED_CARD_AMOUNT = 2;

const films = new Array(FILMS_AMOUNT).fill().map(generateFilm);
const filters = generateFilters(films);

const watchedFilmsAmount = getRandomInt(0, FILMS_AMOUNT);

const renderCard = (filmsListElement, film) => {
  const cardComponent = new FilmCardView(film);

  const showPopup = () => {
    const popupComponent = new PopupView(film);

    const closePopup = () => {
      popupComponent.getElement().remove();
      bodyElement.removeChild(popupComponent.getElement());
      document.removeEventListener(`keydown`, popupEscPressHandler);
    };

    const popupEscPressHandler = (evt) => {
      if (evt.key === `Escape`) {
        evt.preventDefault();
        closePopup();
        document.removeEventListener(`keydown`, popupEscPressHandler);
      }
    };

    popupComponent.setCloseClickHandler(closePopup);
    bodyElement.appendChild(popupComponent.getElement());
    document.addEventListener(`keydown`, popupEscPressHandler);
  };

  cardComponent.setPosterClickHandler(showPopup);
  cardComponent.setTitleClickHandler(showPopup);
  cardComponent.setCommentsClickHandler(showPopup);

  renderElement(filmsListElement, cardComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteHeaderElement = document.querySelector(`.header`);
if (films.length > 0 && watchedFilmsAmount > 0) {
  renderElement(siteHeaderElement, new UserProfileView(watchedFilmsAmount).getElement(), RenderPosition.BEFOREEND);
}

const siteMainElement = document.querySelector(`.main`);
renderElement(siteMainElement, new MenuView(filters).getElement(), RenderPosition.BEFOREEND);

if (films.length > 0) {
  renderElement(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
}

const filmsComponent = new FilmsContentView();
renderElement(siteMainElement, filmsComponent.getElement(), RenderPosition.BEFOREEND);

if (films.length === 0) {
  const noFilmsComponent = new NoFilmsView();
  renderElement(filmsComponent.getElement(), noFilmsComponent.getElement(), RenderPosition.BEFOREEND);
} else {
  const mainFilmsListComponent = new MainFilmsListContentView();
  renderElement(filmsComponent.getElement(), mainFilmsListComponent.getElement(), RenderPosition.BEFOREEND);

  const filmsListComponent = new FilmsListView();
  renderElement(mainFilmsListComponent.getElement(), filmsListComponent.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < Math.min(FILMS_AMOUNT_PER_STEP, FILMS_AMOUNT); i++) {
    renderCard(filmsListComponent.getElement(), films[i]);
  }

  if (films.length > FILMS_AMOUNT_PER_STEP) {
    let renderedFilmsCount = FILMS_AMOUNT_PER_STEP;
    const showMoreButtonComponent = new ShowmoreButtonView();
    renderElement(mainFilmsListComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    showMoreButtonComponent.setClickHandler(() => {
      films
        .slice(renderedFilmsCount, renderedFilmsCount + FILMS_AMOUNT_PER_STEP)
        .forEach((film) => renderCard(filmsListComponent.getElement(), film));

      renderedFilmsCount += FILMS_AMOUNT_PER_STEP;

      if (renderedFilmsCount >= FILMS_AMOUNT) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }

  const topRatedComponent = new TopRatedView();
  renderElement(filmsComponent.getElement(), topRatedComponent.getElement(), RenderPosition.BEFOREEND);
  const topRatedFilmsListComponent = new FilmsListView();
  renderElement(topRatedComponent.getElement(), topRatedFilmsListComponent.getElement(), RenderPosition.BEFOREEND);

  if (films.length < TOPRATED_CARD_AMOUNT) {
    for (let i = 0; i < films.length; i++) {
      renderCard(topRatedFilmsListComponent.getElement(), films[i]);
    }
  } else {
    for (let i = 0; i < TOPRATED_CARD_AMOUNT; i++) {
      renderCard(topRatedFilmsListComponent.getElement(), films[i]);
    }
  }

  const mostCommentedComponent = new MostCommentedView();
  renderElement(filmsComponent.getElement(), mostCommentedComponent.getElement(), RenderPosition.BEFOREEND);
  const mostCommentedFilmsListComponent = new FilmsListView();
  renderElement(mostCommentedComponent.getElement(), mostCommentedFilmsListComponent.getElement(), RenderPosition.BEFOREEND);

  if (films.length < MOSTCOMMENTED_CARD_AMOUNT) {
    for (let i = 0; i < films.length; i++) {
      renderCard(mostCommentedFilmsListComponent.getElement(), films[i]);
    }
  } else {
    for (let i = 0; i < MOSTCOMMENTED_CARD_AMOUNT; i++) {
      renderCard(mostCommentedFilmsListComponent.getElement(), films[i]);
    }
  }
}

const footerStatisitcsElement = document.querySelector(`.footer__statistics`);
renderElement(footerStatisitcsElement, new FooterStatsView(films).getElement(), RenderPosition.BEFOREEND);
