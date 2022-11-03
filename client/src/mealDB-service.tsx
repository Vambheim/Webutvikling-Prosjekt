import axios from 'axios';

axios.defaults.baseURL = 'https://www.themealdb.com/api/json/v1/1';

export type MealDBRecipe = {
  mealDBId: number;
  name: string;
  category: string;
  country: string;
};

class MealDBService {
  /**
   * Get task with given id.
   */
  get(mealDBId: number) {
    return axios.get<MealDBRecipe>('/lookup.php?i=' + mealDBId).then((response) => response.data);
  }

  /**
   * Get all tasks.
   */
  // getAll() {
  //   return axios.get<Recipe[]>('/recipes').then((response) => response.data);
  // }

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

const mealDBService = new MealDBService();
export default mealDBService;
