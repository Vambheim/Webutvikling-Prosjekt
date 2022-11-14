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
  createUser(email: string, first_name: string, last_name: string, password: string) {
    // endre parametere til bare user? ^
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

  // se over denne og getUser: er jo egt samme greia
  userExistsCheck(email: string) {
    return new Promise<User | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM user WHERE email=?', [email], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        //rejects if user exists and resolves if it does not
        if (results.length > 0) {
          return reject();
        } else {
          return resolve(results[0] as User);
        }
      });
    });
  }
}

const userService = new UserService();
export default userService;
