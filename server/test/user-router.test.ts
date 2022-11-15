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

////////////USER
describe('User register (POST)', () => {
  test('Create new user (200 OK)', (done) => {
    axios
      .post('/users/register', {
        email: 'newuser@mail',
        first_name: 'Test',
        last_name: 'Testerson',
        password: '123abc',
        password2: '123abc',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        //Cannot test if the response data is equal to the hash, because it is different every time
        done();
      });
  });

  test('Create new user with existing email (400 bad request)', (done) => {
    axios
      .post('/users/register', {
        email: 'test@mail',
        first_name: 'Test',
        last_name: 'Testerson',
        password: '123abc',
        password2: '123abc',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });

  test('Create new user with passwords not matching (400 bad request)', (done) => {
    axios
      .post('/users/register', {
        email: 'new@mail',
        first_name: 'New',
        last_name: 'New',
        password: '123abc',
        password2: 'Notmatchingpassword',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });

  test('Create new user with missing input (400 bad request)', (done) => {
    axios
      .post('/users/register', {
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password2: '',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });

  test('Create new user with unvalid email (400 bad request)', (done) => {
    axios
      .post('/users/register', {
        email: 'mail',
        first_name: 'Test',
        last_name: 'Testerson',
        password: '123',
        password2: '123',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });
});

describe('User log in (GET)', () => {
  test.skip('Log in (200 OK)', (done) => {
    axios.get('/users/login/test@mail/password').then((response) => {
      expect(response.status).toEqual(200);
      // expect(response.data).toEqual('noe');
      done();
    });
  });

  test('Wrong password (400 bad request)', (done) => {
    axios.get('/users/login/test@mail/fakePassword').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });

  test('No password (404 Not Found)', (done) => {
    axios.get('/users/login/test@mail/').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 404');
      done();
    });
  });

  test('No user with given email (500 Internal Server Error)', (done) => {
    axios.get('/users/login/wrong@mail/password').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 500');
      done();
    });
  });
});
