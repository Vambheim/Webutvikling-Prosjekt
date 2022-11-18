import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type ShoppingListInfo = {
  shopping_list_id: number;
  recipe_id: number;
  ingredient_id: number;
  name: string;
  amount: number;
  measurement_unit: string;
};

class ShoppingListService {
  /**
   * Get shopping list for given user
   */
  getShoppingList(user_id: number) {
    return axios
      .get<ShoppingListInfo[]>('/shoppinglist/' + user_id)
      .then((response) => response.data);
  }

  /**
   * Add to shopping list for given user
   */
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
   * Delete whole shopping list for given user
   */
  deleteShoppingList(user_id: number) {
    return axios.delete('/shoppinglist/' + user_id).then((response) => response.data);
  }

  /**
   * Delete one item in shopping list
   */
  deleteItemShoppingList(shopping_list_id: number) {
    return axios.delete('/shoppinglistitem/' + shopping_list_id).then((response) => response.data);
  }
}

const shoppingListService = new ShoppingListService();
export default shoppingListService;
