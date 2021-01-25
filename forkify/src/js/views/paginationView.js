import View from './View.js';
import icons from 'url:../../img/icons.svg';


class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;

            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    }

    _generateMarkup() {
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const currentPage = this._data.page;

        if (currentPage === 1 && numPages >1) {
            return `
            ${this._forwardButton(currentPage)}
            `;
        }

        if (currentPage === numPages && numPages > 1) {
            return `
            ${this._backButton(currentPage)}
            `;
        }

        if (currentPage < numPages) {
            return `
                ${this._backButton(currentPage)}
                ${this._forwardButton(currentPage)}
            `;
        }
        
        return '';
    }

    _forwardButton(currentPage) {
        return `
        <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
    } 
    
    _backButton(currentPage) {
        return `
        <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        `;
    }

}

export default new PaginationView();