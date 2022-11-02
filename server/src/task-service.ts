import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

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
    return new Promise<Recipe | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM recipe WHERE id = ?', [id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results[0] as Recipe);
      });
    });
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query('SELECT * FROM recipe', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Recipe[]);
      });
    });
  }

  //   /**
  //    * Create new task having the given title.
  //    *
  //    * Resolves the newly created task id.
  //    */
  //   create(title: string) {
  //     return new Promise<number>((resolve, reject) => {
  //       pool.query('INSERT INTO Tasks SET title=?', [title], (error, results: ResultSetHeader) => {
  //         if (error) return reject(error);

  //         resolve(results.insertId);
  //       });
  //     });
  //   }

  //   /**
  //    * Delete task with given id.
  //    */
  //   delete(id: number) {
  //     return new Promise<void>((resolve, reject) => {
  //       pool.query('DELETE FROM Tasks WHERE id = ?', [id], (error, results: ResultSetHeader) => {
  //         if (error) return reject(error);
  //         if (results.affectedRows == 0) return reject(new Error('No row deleted'));

  //         resolve();
  //       });
  //     });
  //   }
}

const recipeService = new RecipeService();
export default recipeService;
