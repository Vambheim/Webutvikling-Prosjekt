import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Recipe = {
  recipe_id: number;
  name: string;
  category: string;
  country: string;
};

export type RecipeName = {
  recipe_id: number;
  name: number;
};

export type Step = {
  step_id: number;
  order_number: number;
  description: string;
  recipe_id: number;
};

export type RecipeIngredient = {
  ingredient_id: number;
  name: string;
  recipe_id: number;
  amount_per_person: number;
  measurement_unit: string;
};

export type Ingredient = {
  ingredient_id: number;
  name: string;
};

export type ShoppingListInfo = {
  shopping_list_id: number;
  recipe_id: number;
  ingredient_id: number;
  name: string;
  amount: number;
  measurement_unit: string;
};

export type User = {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

class RecipeService {
  /**
   * Get recipe with given id.
   */
  get(recipe_id: number) {
    return axios.get<Recipe>('/recipes/' + recipe_id).then((response) => response.data);
  }

  /**
   * Get all recipes.
   */
  getAll() {
    return axios.get<Recipe[]>('/recipes').then((response) => response.data);
  }

  /**
   * Get all steps with given id
   */
  getSteps(recipe_id: number) {
    return axios.get<Step[]>('/recipes/' + recipe_id + '/steps').then((response) => response.data);
  }

  /**
   * Get ingredients with given id
   */
  getRecipeIngredients(recipe_id: number) {
    return axios
      .get<RecipeIngredient[]>('/recipes/' + recipe_id + '/ingredients')
      .then((response) => response.data);
  }

  /**
   * Get all ingredients in the database
   */
  getAllIngredients() {
    return axios.get<Ingredient[]>('/ingredients').then((response) => response.data);
  }

  /**
   * Get filtered recipes
   */

  /*
  getFilteredRecipes(country: string, category: string, ingredient: string) {
    return axios
      .get<Recipe[]>('/recipes/' + country + '/' + category + '/' + ingredient)
      .then((response) => response.data);
  }
  */

  getFilteredByCountryAndCategory(country: string, category: string) {
    return axios
      .get<Recipe[]>('/countryandcategoryfilter/' + country + '/' + category)
      .then((response) => response.data);
  }

  getRecommendedRecipes(recipe_id: number, category: string, country: string) {
    return axios
      .get<Recipe[]>('/recipes/' + recipe_id + '/recommended/' + category + '/' + country)
      .then((response) => response.data);
  }

  //Rename to updateRecipe
  update(recipe: Recipe) {
    return axios.put('/recipes', recipe).then((response) => response.data);
  }

  /**
   * Create new recipe.
   *
   * Resolves the newly created task id.
   */
  //endre til createRecipe
  create(name: string, category: string, country: string) {
    return axios
      .post<{ recipe_id: number }>('/recipes', {
        name: name,
        category: category,
        country: country,
      })
      .then((response) => response.data.recipe_id);
  }

  getShoppingList(user_id: number) {
    return axios
      .get<ShoppingListInfo[]>('/shoppinglist/' + user_id)
      .then((response) => response.data);
  }

  addToShoppingList(
    recipe_id: number,
    ingredient_id: number,
    user_id: number,
    amount: number,
    measurement_unit: string
  ) {
    return axios
      .post('/shoppinglist', {
        recipe_id: recipe_id,
        ingredient_id: ingredient_id,
        user_id: user_id,
        amount: amount,
        measurement_unit: measurement_unit,
      })
      .then((response) => response.data);
  }

  /**
   *
   */
  createUser(
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    password2: string
  ) {
    return axios
      .post('/user/add', {
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: password,
        password2: password2,
      })
      .then((response) => response.data);
  }

  /**
   * Log in with email and password
   */
  logIn(email: string, password: string) {
    return axios.get<User>('/login/' + email + '/' + password).then((response) => response.data);
  }

  /**
   * Delete recipe with given id
   */
  delete(recipe_id: number) {
    return axios.delete('/recipes/' + recipe_id).then((response) => response.data);
  }

  /**
   * Delete shoppingList with given user_id
   */
  deleteShoppingList(user_id: number) {
    return axios.delete('/shoppinglist' + user_id).then((response) => response.data);
  }

  /**
   * Delete item in shopping list with given shopping_list_id
   */
  deleteItemShoppingList(shopping_list_id: number) {
    return axios.delete('/shoppinglist' + shopping_list_id).then((response) => response.data);
  }

  /**
   * Like a recipe with given recipe_id when logged in with user_id
   */
  likeRecipe(user_id: number, recipe_id: number) {
    return axios
      .post('/recipes/like', { user_id: user_id, recipe_id: recipe_id })
      .then((response) => response.data);
  }
}

const recipeService = new RecipeService();
export default recipeService;
