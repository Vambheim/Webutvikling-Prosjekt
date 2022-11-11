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
}

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

  getFilterByCountryAndCategory(country: string, category: string) {
    return axios
      .get<Recipe[]>('/countryandcategoryfilter/' + country + '/' + category)
      .then((response) => response.data);
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

  // /**
  //  * Create new task having the given title.
  //  *
  //  * Resolves the newly created task id.
  //  */
  // create(title: string) {
  //   return axios
  //     .post<{ id: number }>('/tasks', { title: title })
  //     .then((response) => response.data.id);
  // }

  //Poster Recipes
  PostSpoonacularRecipes(recipes: Array<RecipeDetailed>) {
    return axios
      .post<Array<RecipeDetailed>>('/spoonacular/recipes/', { recipes })
      .then((response) => response.data);
  }

  //Poster ingridienser
  PostSpoonacularIngriedents(ingridients: Array<Ingredient>) {
    return axios
      .post<Array<Ingredient>>('/spoonacular/ingridients/', { ingridients })
      .then((response) => response.data);
  }

  //Poster data for mange til mange tabellen mellom ingridienser og oppskrifter 
  PostSpoonacularRecipeIngriedents(data: Array<RecipeDetailed>) {
    var ingridients = []

    for (let i = 0; i < data.length;) {
      ingridients.push(data[i].ingriedients)
      i++
    }
    ingridients = ingridients.flat()

    return axios
      .post<Array<Ingredient>>('/spoonacular/ingridients-recipes/', { ingridients })
      .then((response) => response.data);
  }

  //Poster data for steps
  PostSpoonacularSteps(steps: Array<Step>) {
    return axios
      .post<Array<Step>>('/spoonacular/steps/', { steps })
      .then((response) => response.data);
  }
}


const recipeService = new RecipeService();
export default recipeService;
