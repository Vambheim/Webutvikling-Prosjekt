import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import shoppingListService, {
  ShoppingListInfo,
  ShoppingListUserInfo,
} from '../src/shoppingList-service';
import userService, { User } from '../src/user-service';
import { salt } from '../src/API-router';
import bcrypt from 'bcryptjs';

const testUser: User = {
  user_id: 1,
  email: 'test@mail',
  first_name: 'Test',
  last_name: 'Testerson',
  password: '123',
};

const testShoppingListInfo: ShoppingListInfo = {
  shopping_list_id: 1,
  recipe_id: 1,
  ingredient_id: 1,
  name: 'beans',
  amount: 2,
  measurement_unit: 'cans',
};
const testShoppingListUser: ShoppingListUserInfo = {
  recipe_id: 1,
  ingredient_id: 1,
  user_id: 1,
  amount: 2,
  measurement_unit: 'cans',
};

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3002/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3002, () => done());
});

beforeEach((done) => {
  // Delete all users, and reset user_id auto-increment start value
  pool.query('DELETE FROM user', (error) => {
    if (error) return done(error);
    pool.query('ALTER TABLE user AUTO_INCREMENT = 1', (error) => {
      if (error) return done(error);

      bcrypt.hash(testUser.password, salt, (error, hash) => {
        if (error) throw error;
        testUser.password = hash;
        userService
          .createUser(testUser.email, testUser.first_name, testUser.last_name, testUser.password)
          .then(() => done());
      });
    });
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

////////////SHOPPING LIST
describe('Fetch shopping list (GET)', () => {
  test.skip('Fetch shopping list (200 OK)', (done) => {
    axios.get('/shoppinglist/:user_id').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testShoppingListInfo);
      done();
    });
  });
});
