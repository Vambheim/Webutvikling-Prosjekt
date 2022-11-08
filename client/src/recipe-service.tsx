import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Recipe = {
  recipe_id: number;
  name: string;
  category: string;
  country: string;
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
  getFilteredRecipes(country: string, category: string, ingredient: string) {
    return axios
      .get<Recipe[]>('/recipes/' + country + '/' + category + '/' + ingredient)
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
}

const recipeService = new RecipeService();
export default recipeService;
