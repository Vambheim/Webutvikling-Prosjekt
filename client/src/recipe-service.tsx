import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Recipe = {
  recipe_id: number;
  name: string;
  category: string;
  country: string;
};

export type RecipeDetailed = {
  recipe_id: number;
  name: string;
  category: string;
  country: string;
  ingriedients: Array<Ingredient>;
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

export type addIngredient = {
  name: string;
  amount: number;
  measurement_unit: string;
};

export type addStep = {
  description: string;
  order_number: number;
};

class RecipeService {
  /**
   * Get recipe with given recipe_id.
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
   * Create new recipe.
   *
   * Resolves the newly created task id.
   */
  createRecipe(name: string, category: string, country: string) {
    return axios
      .post<{ recipe_id: number }>('/recipes', {
        name: name,
        category: category,
        country: country,
      })
      .then((response) => response.data.recipe_id);
  }

  /**
   * Updates given recipe
   */
  update(recipe: Recipe) {
    return axios.put('/recipes', recipe).then((response) => response.data);
  }

  /**
   * Delete recipe with given id
   */
  delete(recipe_id: number) {
    return axios.delete('/recipes/' + recipe_id).then((response) => response.data);
  }

  /**
   * Get ingredients with given recipe_id
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
   * Creates connection with recipe and ingredient
   */
  createRecipeIngredients(
    name: string,
    recipe_id: number,
    amount_per_person: number,
    measurement_unit: string
  ) {
    return axios
      .post('/recipes/ingredients', {
        name: name,
        recipe_id: recipe_id,
        amount_per_person: amount_per_person,
        measurement_unit: measurement_unit,
      })
      .then((response) => response.data);
  }

  /**
   * Updates given ingredient in given recipe
   */
  updateRecipeIngredient(
    amount_per_person: number,
    measurement_unit: string,
    recipe_id: number,
    ingredient_id: number,
    name: string
  ) {
    return axios
      .put('/recipes/' + recipe_id + '/ingredients/' + ingredient_id, {
        amount_per_person: amount_per_person,
        measurement_unit: measurement_unit,
        name: name,
      })
      .then((response) => response.data);
  }

  /**
   * Get all steps with given recipe_id
   */
  getSteps(recipe_id: number) {
    return axios.get<Step[]>('/recipes/' + recipe_id + '/steps').then((response) => response.data);
  }

  /**
   * Creates new step to given recipe
   */
  createStep(order_number: number, description: string, recipe_id: number) {
    return axios
      .post('/steps', {
        order_number: order_number,
        description: description,
        recipe_id: recipe_id,
      })
      .then((response) => response.data);
  }

  /**
   * Updates given step in given recipe
   */
  updateStep(recipe_id: number, step_id: number, order_number: number, description: string) {
    return axios
      .put('recipes/' + recipe_id + '/steps/' + step_id, {
        order_number: order_number,
        description: description,
      })
      .then((response) => response.data);
  }

  /**
   * Get recipes filtered by country and category
   */
  getFilterByCountryAndCategory(country: string, category: string) {
    return axios
      .get<Recipe[]>('/countryandcategoryfilter/' + country + '/' + category)
      .then((response) => response.data);
  }

  /**
   * Get recipes filtered by category
   */
  getFilterByCategory(category: string) {
    return axios.get<Recipe[]>('/categoryfilter/' + category).then((response) => response.data);
  }

  /**
   * Get recipes filtered by country
   */
  getFilterByCountry(country: string) {
    return axios.get<Recipe[]>('/countryfilter/' + country).then((response) => response.data);
  }

  /**
   * Get recipes filtered by one ingredient
   */
  getFilterByOneIngredient(ingredient1: string) {
    return axios
      .get<Recipe[]>('/oneingredientfilter/' + ingredient1)
      .then((response) => response.data);
  }

  /**
   * Get recipes filtered by two ingredients
   */
  getFilterBy2Ingredients(ingredient1: string, ingredient2: string) {
    return axios
      .get<Recipe[]>('/twoingredientsfilter/' + ingredient1 + '/' + ingredient2)
      .then((response) => response.data);
  }

  /**
   * Get recipes filtered by three ingredients
   */
  getFilterBy3Ingredients(ingredient1: string, ingredient2: string, ingredient3: string) {
    return axios
      .get<Recipe[]>(
        '/threeingredientsfilter/' + ingredient1 + '/' + ingredient2 + '/' + ingredient3
      )
      .then((response) => response.data);
  }

  /**
   * Get recommended recipes to given recipe
   */
  getRecommendedRecipes(recipe_id: number, category: string, country: string) {
    return axios
      .get<Recipe[]>('/recipes/' + recipe_id + '/recommended/' + category + '/' + country)
      .then((response) => response.data);
  }

  /**
   * Likes a given recipe from given user
   */
  likeRecipe(user_id: number, recipe_id: number) {
    return axios
      .post('/recipes/like', { user_id: user_id, recipe_id: recipe_id })
      .then((response) => response.data);
  }

  /**
   * Get liked recipes
   */
  getLikedRecipes(user_id: number) {
    return axios.get<Recipe[]>('/likedRecipes/' + user_id).then((response) => response.data);
  }

  /**
   * Posts recipes from spoonacular
   */
  PostSpoonacularRecipes(recipes: Array<RecipeDetailed>) {
    return axios
      .post<Array<RecipeDetailed>>('/spoonacular/recipes/', { recipes })
      .then((response) => response.data);
  }

  /**
   * Posts ingredients from spoonacular
   */
  PostSpoonacularIngriedents(ingridients: Array<RecipeIngredient>) {
    return axios
      .post<Array<RecipeIngredient>>('/spoonacular/ingridients/', { ingridients })
      .then((response) => response.data);
  }

  /**
   * Posts connection with ingredient and recipe from spoonacular
   */
  PostSpoonacularRecipeIngriedents(data: Array<RecipeDetailed>) {
    var ingridients = [];

    for (let i = 0; i < data.length;) {
      ingridients.push(data[i].ingriedients);
      i++;
    }
    ingridients = ingridients.flat();

    return axios
      .post<Array<RecipeIngredient>>('/spoonacular/ingridients-recipes/', { ingridients })
      .then((response) => response.data);
  }

  /**
   * Posts steps from spoonacular
   */
  PostSpoonacularSteps(steps: Array<Step>) {
    return axios
      .post<Array<Step>>('/spoonacular/steps/', { steps })
      .then((response) => response.data);
  }
}

const recipeService = new RecipeService();
export default recipeService;
