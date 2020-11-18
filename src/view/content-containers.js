export const createFilmsTemplate = () => {
  return `<section class="films">
          </section>
         `;
};

export const createFilmsListTemplate = () => {
  return `<section class="films-list">
            <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
            <div class="films-list__container">
            </div>
          </section>
         `;
};

export const createTopratedTemplate = () => {
  return `<section class="films-list films-list--extra toprated">
            <h2 class="films-list__title">Top rated</h2>
            <div class="films-list__container">
            </div>
          </section>
         `;
};

export const createMostCommentedTemplate = () => {
  return `<section class="films-list films-list--extra mostcommented">
            <h2 class="films-list__title">Most Commented</h2>
            <div class="films-list__container">
            </div>
          </section>
         `;
};
