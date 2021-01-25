import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for the given query. Please try again!';
    _message = 'Operation successful!';

    _generateMarkup() {
        return this._data
            .map(result => previewView.render(result, false))
            .join('');  
    }
}

export default new ResultsView();