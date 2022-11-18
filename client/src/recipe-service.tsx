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

  getFilterByCountryAndCategory(country: string, category: string) {
    return axios
      .get<Recipe[]>('/countryandcategoryfilter/' + country + '/' + category)
      .then((response) => response.data);
  }

  getFilterByCategory(category: string) {
    return axios.get<Recipe[]>('/categoryfilter/' + category).then((response) => response.data);
  }

  getFilterByCountry(country: string) {
    return axios.get<Recipe[]>('/countryfilter/' + country).then((response) => response.data);
  }

  getFilterByOneIngredient(ingredient1: string) {
    return axios
      .get<Recipe[]>('/oneingredientfilter/' + ingredient1)
      .then((response) => response.data);
  }

  getFilterBy2Ingredients(ingredient1: string, ingredient2: string) {
    return axios
      .get<Recipe[]>('/twoingredientsfilter/' + ingredient1 + '/' + ingredient2)
      .then((response) => response.data);
  }

  getFilterBy3Ingredients(ingredient1: string, ingredient2: string, ingredient3: string) {
    return axios
      .get<Recipe[]>(
        '/threeingredientsfilter/' + ingredient1 + '/' + ingredient2 + '/' + ingredient3
      )
      .then((response) => response.data);
  }

  getRecommendedRecipes(recipe_id: number, category: string, country: string) {
    return axios
      .get<Recipe[]>('/recipes/' + recipe_id + '/recommended/' + category + '/' + country)
      .then((response) => response.data);
  }

  getLikedRecipes(user_id: number) {
    return axios.get<Recipe[]>('/likedRecipes/' + user_id).then((response) => response.data);
  }

  //Rename to updateRecipe
  update(recipe: Recipe) {
    return axios.put('/recipes', recipe).then((response) => response.data);
  }

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

  updateStep(recipe_id: number, step_id: number, order_number: number, description: string) {
    return axios
      .put('recipes/' + recipe_id + '/steps/' + step_id, {
        order_number: order_number,
        description: description,
      })
      .then((response) => response.data);
  }

  /**
   * Create new recipe.
   *
   * Resolves the newly created task id. LA STÅ THOMAS
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
   * Delete recipe with given id
   */
  delete(recipe_id: number) {
    return axios.delete('/recipes/' + recipe_id).then((response) => response.data);
  }

  likeRecipe(user_id: number, recipe_id: number) {
    return axios
      .post('/recipes/like', { user_id: user_id, recipe_id: recipe_id })
      .then((response) => response.data);
  }

  //Post Recipes from Spoonacular
  PostSpoonacularRecipes(recipes: Array<RecipeDetailed>) {
    return axios
      .post<Array<RecipeDetailed>>('/spoonacular/recipes/', { recipes })
      .then((response) => response.data);
  }

  //Post Ingridiences from Spoonacular
  PostSpoonacularIngriedents(ingridients: Array<RecipeIngredient>) {

    return axios
      .post<Array<RecipeIngredient>>('/spoonacular/ingridients/', { ingridients })
      .then((response) => response.data);
  }

  //Post data for the many to many between ingridiences and recipes
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

  //Post data for steps
  PostSpoonacularSteps(steps: Array<Step>) {
    return axios
      .post<Array<Step>>('/spoonacular/steps/', { steps })
      .then((response) => response.data);
  }
}

const recipeService = new RecipeService();
export default recipeService;
