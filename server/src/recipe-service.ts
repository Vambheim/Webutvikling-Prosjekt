import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader, OkPacket } from 'mysql2';

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

  getFilterByIngredients(
    ingredient1: string,
    ingredient2: string,
    ingredient3: string,
    activeFilters: number
  ) {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query(
        'SELECT recipe.recipe_id, recipe.name, recipe.category, recipe.country FROM ingredient JOIN recipe_ingredient ON ingredient.ingredient_id = recipe_ingredient.ingredient_id JOIN recipe ON recipe_ingredient.recipe_id = recipe.recipe_id WHERE ingredient.name NOT IN (SELECT ingredient.name FROM ingredient WHERE name!=? && name!=? && name!=?) GROUP BY recipe.recipe_id HAVING count(recipe.recipe_id) = ?',
        [ingredient1, ingredient2, ingredient3, activeFilters],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Recipe[]);
        }
      );
    });
  }

  getFilterByCountryAndCategory(country: string, category: string) {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query(
        'SELECT * FROM recipe WHERE country=? AND category=?',
        [country, category],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Recipe[]);
        }
      );
    });
  }

  createRecipe(name: string, country: string, category: string) {
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

  createIngredient(name: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO ingredient SET name=?', [name], (error, results: ResultSetHeader) => {
        if (error) return reject(error);

        resolve(results.insertId);
      });
    });
  }

  createStep(order_number: number, description: string, recipe_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO step SET order_number=?, description=?, recipe_id=?',
        [order_number, description, recipe_id],
        (error, _results) => {
          if (error) return reject(error);
          // trenger jeg å bruke noe av resultatet her nå eller?
          resolve();
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

  ingredientExistsCheck(name: string) {
    return new Promise<Ingredient>((resolve, reject) => {
      pool.query(
        'SELECT * FROM ingredient WHERE name=?',
        [name],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          if (results.length == 1) {
            return resolve(results[0] as Ingredient);
          } else {
            return reject();
          }
        }
      );
    });
  }

  deleteRecipeIngredient(ingredient_id: number, recipe_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM recipe_ingredient WHERE ingredient_id=? AND recipe_id=?',
        [ingredient_id, recipe_id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) reject(new Error('No row deleted'));

          resolve();
        }
      );
    });
  }

  createRecipeIngredient(
    ingredient_id: number,
    recipe_id: number,
    amount_per_person: number,
    measurement_unit: number
  ) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO recipe_ingredient SET ingredient_id=?, recipe_id=?, amount_per_person=?, measurement_unit=?',
        [ingredient_id, recipe_id, amount_per_person, measurement_unit],
        (error, _results) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  // denne er ikke nødvendig lenger, kan like greit slette og legge til ny rad ved endringer
  // dette er fordi man ikke kan endre navnet på ingrediens her uten å slette rad først
  updateRecipeIngredient(
    amount_per_person: number,
    measurement_unit: string,
    recipe_id: number,
    ingredient_id: number
  ) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE recipe_ingredient SET amount_per_person=?, measurement_unit=? WHERE recipe_id=? AND ingredient_id=?',
        [amount_per_person, measurement_unit, recipe_id, ingredient_id],
        (error, _results) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  // trenger ikke denne heller, samme grunn som over ^
  updateRecipeNewIngredient(
    ingredient_id: number,
    amount_per_person: number,
    measurement_unit: string,
    recipe_id: number
  ) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE recipe_ingredient SET ingredient_id=?, amount_per_person=?, measurement_unit=? WHERE recipe_id=?',
        [ingredient_id, amount_per_person, measurement_unit, recipe_id],
        (error, _results) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  updateSteps(order_number: number, description: string, step_id: number, recipe_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE step SET order_number=?, description=? WHERE step_id=? AND recipe_id=?',
        [order_number, description, step_id, recipe_id],
        (error, _results) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  // se over denne og getUser: er jo egt samme greia
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
  // endre navn til deleteRecipe?
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
   * Deletes items in shoppinglist with given user_id
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

  likeRecipe(user_id: number, recipe_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO like_information SET user_id=?, recipe_id=?, liked=?',
        [user_id, recipe_id, 1],
        (error, _results) => {
          if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
              return reject('You have already liked this recipe');
            } else {
              return reject(error);
            }
          }
          resolve();
        }
      );
    });
  }

  getRecomendedRecipes(recipe_id: number, category: string, country: string) {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query(
        'SELECT recipe.recipe_id, recipe.name, recipe.category, recipe.country FROM recipe JOIN like_information ON recipe.recipe_id = like_information.recipe_id WHERE like_information.liked = TRUE AND recipe.category =? AND recipe.country =? AND recipe.recipe_id != ? GROUP BY recipe.recipe_id ORDER BY COUNT(like_information.liked) DESC LIMIT ?',
        //Limits to three recommended recipes
        //Also put out the three most popular recipes given the same category and country
        [category, country, recipe_id, 3],
        (error, results: RowDataPacket[]) => {
          if (error) reject(error);

          resolve(results as Recipe[]);
        }
      );
    });
  }

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
