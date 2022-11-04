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
  description: string;
  order_number: number;
  recipe_id: number;
};

export type Ingredient = {
  ingredient_id: number;
  name: string;
  recipe_id: number;
  amount_per_person: number;
  measurement_unit: string;
};

export type User = {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
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
  getIngredients(recipe_id: number) {
    return axios
      .get<Ingredient[]>('/recipes/' + recipe_id + '/ingredients')
      .then((response) => response.data);
  }

  update(recipe: Recipe) {
    return axios.put('/recipes', recipe).then((response) => response.data);
  }

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  create(name: string, category: string, country: string) {
    return axios
      .post<{ recipe_id: number }>('/recipes', {
        name: name,
        category: category,
        country: country,
      })
      .then((response) => response.data.recipe_id);
  }
}

const recipeService = new RecipeService();
export default recipeService;
