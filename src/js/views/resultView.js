import View from './view';
import previewView from './previewView';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query. Please try again!`;

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }

  addHandelerResult(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new ResultView();
