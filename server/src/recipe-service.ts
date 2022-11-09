import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Recipe = {
  recipe_id: number;
  name: string;
  category: string;
  country: string;
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

export type Step = {
  step_id: number;
  order_number: number;
  description: string;
  recipe_id: number;
};

export type User = {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

export type ShoppingListInfo = {
  shopping_list_id: number;
  recipe_id: number;
  ingredient_id: number;
  user_id: number;
  amount: number;
  measurement_unit: string;
};

class RecipeService {
  /**
   * Get all recipes.
   */

  //endre navn til getAllRecipes?
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

  //endre navn til getRecipe?
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
   * Gets all ingredients for given recipe
   */

  getIngredientsToRecipe(recipe_id: number) {
    return new Promise<RecipeIngredient[]>((resolve, reject) => {
      pool.query(
        'SELECT * FROM recipe_ingredient JOIN ingredient ON recipe_ingredient.ingredient_id = ingredient.ingredient_id WHERE recipe_id = ?',
        [recipe_id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as RecipeIngredient[]);
        }
      );
    });
  }

  getAllIngredients() {
    return new Promise<Ingredient[]>((resolve, reject) => {
      pool.query('SELECT * FROM ingredient', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Ingredient[]);
      });
    });
  }

  getFilteredRecipe(country: string, category: string, ingredient: string) {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query(
        'SELECT recipe.recipe_id, recipe.name, recipe.category, recipe.country FROM recipe JOIN recipe_ingredient ON recipe.recipe_id = recipe_ingredient.recipe_id JOIN ingredient ON recipe_ingredient.ingredient_id = ingredient.ingredient_id WHERE recipe.country=? AND recipe.category=? AND ingredient.name=?',
        [country, category, ingredient],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Recipe[]);
        }
      );
    });
  }

  // endre navn til createRecipe
  create(name: string, country: string, category: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO recipe SET name = ?, category = ?,  country = ?',
        [name, category, country],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve(results.insertId);
        }
      );
    });
  }
  // endre navn til updateRecipe
  update(recipe: Recipe) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE recipe SET name=?, category=?, country=? WHERE recipe_id=?',
        [recipe.name, recipe.category, recipe.country, recipe.recipe_id],
        (error, _results) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  userExistsCheck(email: string) {
    return new Promise<User | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM user WHERE email=?', [email], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        if (results.length > 0) {
          return reject();
        } else {
          return resolve(results[0] as User);
        }
      });
    });
  }

  createUser(email: string, first_name: string, last_name: string, password: string) {
    // endre parametere til bare user? ^
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO user SET email=?, first_name=?, last_name=?, password=?',
        [email, first_name, last_name, password],
        (error, results) => {
          if (error) return reject(error);

          resolve(results);
        }
      );
    });
  }

  getUser(email: string) {
    return new Promise<User>((resolve, reject) => {
      pool.query('SELECT * FROM user WHERE email=?', [email], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        if (results.length > 0) {
          resolve(results[0] as User);
        } else {
          reject('No user found');
        }
      });
    });
  }

  /**
   * Delete recipe with given id.
   */
  delete(recipe_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM recipe WHERE recipe_id = ?',
        [recipe_id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) reject(new Error('No row deleted'));
          resolve();
        }
      );
    });
  }

  /**
   * Get shoppingList with give user_id
   */

  getShoppingList(user_id: number) {
    return new Promise<ShoppingListInfo[]>((resolve, reject) => {
      pool.query(
        'SELECT shopping_list.shopping_list_id,shopping_list.recipe_id, ingredient.ingredient_id, ingredient.name, shopping_list.amount, shopping_list.measurement_unit FROM shopping_list JOIN user ON shopping_list.user_id=user.user_id JOIN ingredient ON shopping_list.ingredient_id = ingredient.ingredient_id WHERE user.user_id = 6',
        [user_id],
        (error, results: RowDataPacket[]) => {
          resolve(results as ShoppingListInfo[]);

          if (error) return reject(error);
        }
      );
    });
  }

  pushToShoppingList(
    recipe_id: number,
    ingredient_id: number,
    user_id: number,
    amount: number,
    measurement_unit: string
  ) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO shopping_list SET recipe_id = ?, ingredient_id = ?, user_id = ?, amount = ?, measurement_unit = ?',
        [recipe_id, ingredient_id, user_id, amount, measurement_unit],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  // Fjerne individuell ingrediens fra handlekurv
  removeOne(shopping_list_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM shopping_list WHERE shopping_list_id = ?',
        [shopping_list_id],
        (error) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  // getSteps(recipe_id: number) {
  //   return new Promise<Step[]>((resolve, reject) => {
  //     pool.query(
  //       'SELECT * FROM step WHERE recipe_id = ?',
  //       [recipe_id],
  //       (error, results: RowDataPacket[]) => {
  //         if (error) return reject(error);

  //         resolve(results as Step[]);
  //       }
  //     );
  //   });
  // }

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
