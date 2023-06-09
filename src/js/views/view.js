import icons from 'url:../../img/icons.svg';

export default class View {
  /**
   * Render the recived object to the DOM
   * @param {Object | Object[]} data The data to be rendered in the DOM e.g(recipe)
   * @param {boolean} render If false, Create markup string instead of renderig in the DOM
   * @returns {undefined | string} Markup string is returned if render=false
   * @author Islam Ali
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(this._errorMessage);

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this.#insertToParent(markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDOM.querySelectorAll('*'));
    const currentElement = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElement.forEach((newEl, i) => {
      const curEl = currentElement[i];

      // Fuction to Update the changed text only
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        curEl.textContent = newEl.textContent;

      // Fuction to Update the changed attributes only
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  #insertToParent(markup) {
    this._parentElement.innerHTML = ``;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
      `;
    this.#insertToParent(markup);
  }

  renderError(err) {
    const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${this.#handlingErrorMessage(err)}</p>
          </div>
          `;
    this.#insertToParent(markup);
  }

  #handlingErrorMessage(err) {
    if (err.message) {
      const error = err.message.includes('Invalid _id:')
        ? this._errorMessage
        : `${err.message}`;
      return error;
    }
    return err;
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `;
    this.#insertToParent(markup);
  }
}

// array.find and all
// promise
// async function
// uninstall regenerator
