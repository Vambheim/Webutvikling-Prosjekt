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

  getFilterByCategory(category: string) {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query(
        'SELECT * FROM recipe WHERE category=?',
        [category],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Recipe[]);
        }
      );
    });
  }

  getFilterByCountry(country: string) {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query(
        'SELECT * FROM recipe WHERE country=?',
        [country],
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

  // // se over denne og getUser: er jo egt samme greia
  // userExistsCheck(email: string) {
  //   return new Promise<User | undefined>((resolve, reject) => {
  //     pool.query('SELECT * FROM user WHERE email=?', [email], (error, results: RowDataPacket[]) => {
  //       if (error) return reject(error);

  //       //rejects if user exists and resolves if it does not
  //       if (results.length > 0) {
  //         return reject();
  //       } else {
  //         return resolve(results[0] as User);
  //       }
  //     });
  //   });
  // }

  // createUser(email: string, first_name: string, last_name: string, password: string) {
  //   // endre parametere til bare user? ^
  //   return new Promise((resolve, reject) => {
  //     pool.query(
  //       'INSERT INTO user SET email=?, first_name=?, last_name=?, password=?',
  //       [email, first_name, last_name, password],
  //       (error, results) => {
  //         if (error) return reject(error);

  //         resolve(results);
  //       }
  //     );
  //   });
  // }

  // getUser(email: string) {
  //   return new Promise<User>((resolve, reject) => {
  //     pool.query('SELECT * FROM user WHERE email=?', [email], (error, results: RowDataPacket[]) => {
  //       if (error) return reject(error);

  //       if (results.length > 0) {
  //         resolve(results[0] as User);
  //       } else {
  //         reject('No user found');
  //       }
  //     });
  //   });
  // }

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

  getLikedRecipes(user_id: number) {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query(
        'SELECT recipe.recipe_id, recipe.name, recipe.category, recipe.country FROM like_information JOIN recipe ON like_information.recipe_id = recipe.recipe_id WHERE like_information.liked = TRUE AND like_information.user_id = ?',
        [user_id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Recipe[]);
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
          if (error) return reject(error);

          resolve(results as Recipe[]);
        }
      );
    });
  }

  //API Recipe -> Database Recipes
  PostSpoonacularRecipes(data: Array<Recipe>) {
    return new Promise<void>((resolve, reject) => {
      for (let i = 0; i < data.length; ) {
        pool.query(
          'INSERT INTO recipe SET recipe_id=?, name=?, category=?, country=? ON DUPLICATE KEY UPDATE name=?, category=?, country=?',
          [
            data[i]['recipe_id'],
            data[i]['name'],
            data[i]['category'],
            data[i]['country'],
            data[i]['name'],
            data[i]['category'],
            data[i]['country'],
          ],
          (error, results: ResultSetHeader) => {
            if (error) return reject(error);
          }
        );

        i++;
      }

      resolve();
    });
  }

  //API Ingridients -> Database Ingridients
  PostSpoonacularIngridients(data: Array<RecipeIngredient>) {
    return new Promise<void>((resolve, reject) => {
      for (let i = 0; i < data.length; ) {
        pool.query(
          'INSERT INTO ingredient SET ingredient_id=?, name=? ON DUPLICATE KEY UPDATE name=?',
          [data[i]['ingredient_id'], data[i]['name'], data[i]['name']],
          (error, results: ResultSetHeader) => {
            if (error) return reject(error);
          }
        );

        i++;
      }

      resolve();
    });
  }

  //API RecipesIngridients -> Database RecipesIngridients
  PostSpoonacularRecipesIngridients(data: Array<RecipeIngredient>) {
    return new Promise<void>((resolve, reject) => {
      for (let i = 0; i < data.length; ) {
        pool.query(
          'INSERT INTO recipe_ingredient SET recipe_id=?, ingredient_id=?, amount_per_person=?, measurement_unit=? ON DUPLICATE KEY UPDATE amount_per_person=?, measurement_unit=?',
          [
            data[i]['recipe_id'],
            data[i]['ingredient_id'],
            data[i]['amount_per_person'],
            data[i]['measurement_unit'],
            data[i]['amount_per_person'],
            data[i]['measurement_unit'],
          ],
          (error, results: ResultSetHeader) => {
            if (error) return reject(error);
          }
        );

        i++;
      }

      resolve();
    });
  }

  //API Steps -> Database Step
  PostSpoonacularSteps(data: Array<Step>) {
    return new Promise<void>((resolve, reject) => {
      for (let i = 0; i < data.length; ) {
        pool.query(
          'INSERT INTO step SET order_number=?, description=?, recipe_id=? ON DUPLICATE KEY UPDATE order_number=?, description=?, recipe_id=?',
          [
            data[i]['order_number'],
            data[i]['description'],
            data[i]['recipe_id'],
            data[i]['order_number'],
            data[i]['description'],
            data[i]['recipe_id'],
          ],
          (error, results: ResultSetHeader) => {
            if (error) return reject(error);
          }
        );

        i++;
      }

      resolve();
    });
  }
}

const recipeService = new RecipeService();
export default recipeService;
