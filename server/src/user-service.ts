import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader, OkPacket } from 'mysql2';

export type User = {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

class UserService {
  /**
   * Create new user
   */
  createUser(email: string, first_name: string, last_name: string, password: string) {
    return new Promise<User>((resolve, reject) => {
      pool.query(
        'INSERT INTO user SET email=?, first_name=?, last_name=?, password=?',
        [email, first_name, last_name, password],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0] as User);
        }
      );
    });
  }

  /**
   * Get user with given email
   */
  getUser(email: string) {
    return new Promise<User>((resolve, reject) => {
      pool.query('SELECT * FROM user WHERE email=?', [email], (error, results: RowDataPacket[]) => {
        if (error) return reject(error.message);

        if (results.length != 0) {
          resolve(results[0] as User);
        } else {
          reject('No user with this email');
        }
      });
    });
  }

  /**
   * Check if the user exist
   */
  userExistsCheck(email: string) {
    return new Promise<void>((resolve, reject) => {
      pool.query('SELECT * FROM user WHERE email=?', [email], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        //rejects if user exists and resolves if it does not
        if (results.length > 0) {
          return reject();
        } else {
          resolve();
        }
      });
    });
  }
}

const userService = new UserService();
export default userService;
