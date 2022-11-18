import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader, OkPacket } from 'mysql2';

//endre fra info til details
export type ShoppingListUserInfo = {
  recipe_id: number;
  ingredient_id: number;
  user_id: number;
  amount: number;
  measurement_unit: string;
};

// endre fra info til details
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
   * Get shoppingList with given user_id
   */
  getShoppingList(user_id: number) {
    return new Promise<ShoppingListInfo[]>((resolve, reject) => {
      pool.query(
        'SELECT shopping_list.shopping_list_id,shopping_list.recipe_id, ingredient.ingredient_id, ingredient.name, shopping_list.amount, shopping_list.measurement_unit FROM shopping_list JOIN user ON shopping_list.user_id=user.user_id JOIN ingredient ON shopping_list.ingredient_id = ingredient.ingredient_id WHERE user.user_id = ? ORDER BY shopping_list.shopping_list_id ASC',
        //Newest ingredients are on the bottom of the list
        [user_id],
        (error, results: RowDataPacket[]) => {
          resolve(results as ShoppingListInfo[]);

          if (error) return reject(error);
        }
      );
    });
  }

  /**
   * Deletes entire shoppingList with given user_id
   */
  deleteShoppingList(user_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM shopping_list WHERE user_id=?',
        [user_id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) reject(new Error('No list deleted'));

          resolve();
        }
      );
    });
  }

  /**
   * Deletes one item in the shoppingList with given shopping_list_id
   */
  deleteItemShoppingList(shopping_list_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM shopping_list WHERE shopping_list_id=?',
        [shopping_list_id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) reject(new Error('No item in list deleted'));

          resolve();
        }
      );
    });
  }

  /**
   * Adds item to shoppinglist
   */
  addToShoppingList(list: ShoppingListUserInfo) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO shopping_list SET recipe_id = ?, ingredient_id = ?, user_id = ?, amount = ?, measurement_unit = ?',
        [list.recipe_id, list.ingredient_id, list.user_id, list.amount, list.measurement_unit],
        (error, _results) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }
}

const shoppingListService = new ShoppingListService();
export default shoppingListService;
