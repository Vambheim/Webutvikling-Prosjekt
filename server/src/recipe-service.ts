import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Recipe = {
  recipe_id: number;
  name: string;
  category: string;
  country: string;
};

export type Ingredient = {
  ingredient_id: number;
  name: string;
};

export type Step = {
  step_id: number;
  order_number: number;
  description: string;
  recipe_id: number;
};

class RecipeService {
  /**
   * Get all recipes.
   */
  getAll() {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query('SELECT * FROM recipe', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Recipe[]);
      });
    });
  }

  /**
   * Get recipe with given recipe_id.
   */
  get(recipe_id: number) {
    return new Promise<Recipe | undefined>((resolve, reject) => {
      pool.query(
        'SELECT * FROM recipe WHERE recipe_id = ?',
        [recipe_id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0] as Recipe);
        }
      );
    });
  }

  /**
   * Get steps connected to given recipe
   */
  getSteps(recipe_id: number) {
    return new Promise<Step[]>((resolve, reject) => {
      pool.query(
        'SELECT * FROM step WHERE recipe_id = ?',
        [recipe_id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Step[]);
        }
      );
    });
  }

  /**
   * Create new recipe.
   *h
   * Resolves the newly created recipe_id.
   */
  // create(title: string) {
  //   return new Promise<number>((resolve, reject) => {
  //     pool.query('INSERT INTO Recipe SET title=?', [title], (error, results: ResultSetHeader) => {
  //       if (error) return reject(error);

  //       resolve(results.insertId);
  //     });
  //   });
  // }

  /**
   * Delete task with given id.
   */
  // delete(id: number) {
  //   return new Promise<void>((resolve, reject) => {
  //     pool.query('DELETE FROM Tasks WHERE id = ?', [id], (error, results: ResultSetHeader) => {
  //       if (error) return reject(error);
  //       if (results.affectedRows == 0) return reject(new Error('No row deleted'));

  //       resolve();
  //     });
  //   });
  // }
}

// class IngredientService {

// }

// class UserService {

// }

// class ShoppingListService {

// }

const recipeService = new RecipeService();
export default recipeService;

//Mock-up av hvordan vi skal laste inn Spoontacular-informasjonen i databaasen:
// let Oppskrifter = []

// getAll() {
//   return axios.get<Oppskrifter[]>('/spoontacularAPI').then((response) => response.data);
// }

// Oppskrifter.map((oppskrift) => {
//   database('INSERT INTO recipe (recipe_id, name, category, country) VALUES = ?', [oppskrift["id"], oppskrift["recipeName"], oppskrift["category"] ]) //Pusher altså
// })
