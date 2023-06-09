import View from './view';
import icons from 'url:../../img/icons.svg';
import { state } from '../model.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const pagesCount = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    if (curPage === 1 && pagesCount > 1)
      return this.renderButton('next', curPage);

    if (curPage === pagesCount && pagesCount > 1)
      return this.renderButton('prev', curPage);

    if (curPage > 1 && pagesCount > 1) {
      return ` ${this.renderButton('prev', curPage)} 
      ${this.renderButton('next', curPage)}`;
    }

    return '';
  }

  renderButton(type, curPage) {
    if (type === 'prev')
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
      `;

    if (type === 'next')
      return `
              <button data-goto="${
                curPage + 1
              }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
  }

  addHandelerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      handler(+btn.getAttribute('data-goto'));
    });
  }
}

export default new PaginationView();
