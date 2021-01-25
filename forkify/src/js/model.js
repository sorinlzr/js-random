import { API_KEY, API_URL } from './config.js';
import { RESULTS_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = function (data) {
    const {recipe} = data.data;
    return {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            ...(recipe.key && { key: recipe.key}),
        };
};

export const loadRecipe = async function(recipeId) {
    try {
        const data = await AJAX(`${API_URL}${recipeId}?key=${API_KEY}`);
        state.recipe = createRecipeObject(data);
        
        if (state.bookmarks.some(bookmark => bookmark.id === recipeId))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
            console.log(state.recipe);
    } catch(error) {
        console.error(`${error}`);
        throw error;
    }
};

export const loadSearchResults = async function(query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`)
        console.log(data);

        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && { key: recipe.key}),     
            };
        });
        state.search.page = 1;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;
    const start = (page -1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    
    return state.search.results.slice(start, end);
};

export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });
    state.recipe.servings = newServings;
};

const persistBookmarks = function() {
    try {
        localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
      } catch (err) {
        console.error(err, "localStorage disabled, can't use bookmarks");
      }
};

export const addBookmark = function(recipe) {
    //add a bookmark
    state.bookmarks.push(recipe);

    //mark the recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
};

export const deleteBookmark = function(id) {
    //delete bookmark
    const index = state.bookmarks.findIndex(elem => elem.id === id);

    //mark the current recipe as not bookmarked
    state.bookmarks.splice(index, 1);
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
};

const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
            const ingrArr = ing[1].split(',').map(el => el.trim());
            if (ingrArr.length !== 3) throw new Error('Wrong ingredient format, please check your input');
            
            const [quantity, unit, description] = ingrArr;
            return {quantity: quantity ? +quantity: null , unit, description};
        });
        
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };      

        console.log(recipe);
        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (err) {
      throw(err);  
    }
};
