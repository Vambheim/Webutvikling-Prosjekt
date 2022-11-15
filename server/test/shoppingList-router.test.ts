import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import shoppingListService, {
  ShoppingListInfo,
  ShoppingListUserInfo,
} from '../src/shoppingList-service';
import recipeService, { Ingredient, Recipe } from '../src/recipe-service';
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

const testRecipe: Recipe = {
  recipe_id: 1,
  name: 'Chili con carne',
  category: 'stew',
  country: 'Mexico',
};

const testIngredients: Ingredient = { ingredient_id: 1, name: 'beans' };

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
  pool.query('DELETE FROM recipe', (error) => {
    if (error) return done(error);
    //resets the auto_increment
    pool.query('ALTER TABLE recipe AUTO_INCREMENT = 1', (error) => {
      if (error) return done(error);
      recipeService.createRecipe(testRecipe.name, testRecipe.country, testRecipe.category);
    });
  });

  pool.query('DELETE FROM ingredient', (error) => {
    if (error) return done(error);
    //resets the auto_increment
    pool.query('ALTER TABLE ingredient AUTO_INCREMENT = 1', (error) => {
      if (error) return done(error);
      recipeService.createIngredient(testIngredients.name);
    });
  });

  pool.query('DELETE FROM user', (error) => {
    if (error) return done(error);
    pool.query('ALTER TABLE user AUTO_INCREMENT = 1', (error) => {
      if (error) return done(error);
      userService.createUser(
        testUser.email,
        testUser.first_name,
        testUser.last_name,
        testUser.password
      );
    });
  });

  pool.query('DELETE FROM shopping_list', (error) => {
    if (error) return done(error);
    pool.query('ALTER TABLE shopping_list AUTO_INCREMENT = 1', (error) => {
      if (error) return done(error);
      if (error) throw error;
      shoppingListService.addToShoppingList(testShoppingListUser).then(() => done());
    });
  });

  // Delete all shoppinglists, and reset shopping_list_id auto-increment start value
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

////////////SHOPPING LIST
describe('Fetch shopping list (GET)', () => {
  test('Fetch shopping list (200 OK)', (done) => {
    axios.get('/shoppinglist/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testShoppingListInfo]);
      done();
    });
  });
});
