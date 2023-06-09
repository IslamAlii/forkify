import * as model from './model.js';
import * as config from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bookmarkView from './views/bookmarkView.js';

///////////////////////////////////////

async function ControlRecipes() {
  try {
    // Checking if there is a hash in the link
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Udate Results view to mark the selected search result
    resultView.update(model.getSearchResultsPage());

    // Updating the bookmarks
    bookmarkView.update(model.state.bookmarks);

    // Rendering the spinner
    recipeView.renderSpinner();

    // Loading recipie
    await model.loadRecipie(id);
    const { recipe } = model.state;

    // Rendering the recipie in the DOM
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError(err);
  }
}

async function ControlSearchResult() {
  try {
    resultView.renderSpinner();
    const query = await searchView.getQuery();
    await model.loadSearchResults(query);
    resultView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    resultView.renderError(err);
  }
}

function controlPagination(goto) {
  resultView.render(model.getSearchResultsPage(goto));
  paginationView.render(model.state.search);
}

function controlServings(goto) {
  model.updateServings(goto);
  recipeView.update(model.state.recipe);
}

function controlBookmark() {
  bookmarkView.render(model.state.bookmarks);
}

function controlAddBookmark() {
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
}

async function controlUpload(newRecipe) {
  try {
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Rendering the success message
    addRecipeView.renderMessage();

    // Changing the hash URL and rendering the bookmarks
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    bookmarkView.render(model.state.bookmarks);

    // Closing the modal window and rendering the recipe
    setTimeout(() => {
      addRecipeView.toggleWindow();
      recipeView.render(model.state.recipe);
    }, config.MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err);
  }
}

(() => {
  bookmarkView.addHandelerRender(controlBookmark);
  recipeView.addHandelerRender(ControlRecipes);
  recipeView.addHandlerUdateServings(controlServings);
  recipeView.addHandelerAddBookmark(controlAddBookmark);
  searchView.addHandelerSearch(ControlSearchResult);
  paginationView.addHandelerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlUpload);
})();
