import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Recipe = {
  recipe_id: number;
  name: string;
  category: string;
  country: string;
};

class RecipeService {
  /**
   * Get task with given id.
   */
  get(id: number) {
    return axios.get<Recipe>('/recipies/' + recipe_id).then((response) => response.data);
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return axios.get<Recipe[]>('/recipies').then((response) => response.data);
  }

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  // create(title: string) {
  //   return axios
  //     .post<{ id: number }>('/tasks', { title: title })
  //     .then((response) => response.data.id);
  // }
}

const recipeService = new RecipeService();
export default recipeService;
