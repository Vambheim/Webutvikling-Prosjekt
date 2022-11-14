import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import recipeService, { Recipe } from '../src/recipe-service';
import { ShoppingListInfo } from '../src/shoppingList-service';

const testRecipes: Recipe[] = [
  { recipe_id: 1, name: 'Chili con carne', category: 'stew', country: 'Mexico' },
  { recipe_id: 2, name: 'Pizza', category: 'dinner', country: 'Italy' },
  { recipe_id: 3, name: 'Onion soup', category: 'soup', country: 'France' },
];

const testShoppingLists: ShoppingListInfo[] = [];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all recipes, and reset recipe_id auto-increment start value
  pool.query('TRUNCATE TABLE recipe', (error) => {
    if (error) return done(error);

    // Create testRecipes sequentially in order to set correct recipe_id, and call done() when finished
    recipeService
      .createRecipe(testRecipes[0].name, testRecipes[0].category, testRecipes[0].country)
      .then(() =>
        recipeService.createRecipe(
          testRecipes[1].name,
          testRecipes[1].category,
          testRecipes[1].country
        )
      ) // Create testTask[1] after testTask[0] has been created
      .then(() =>
        recipeService.createRecipe(
          testRecipes[2].name,
          testRecipes[2].category,
          testRecipes[2].country
        )
      ) // Create testRecipes[2] after testRecipes[1] has been created
      .then(() => done()); // Call done() after testRecipes[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch tasks (GET)', () => {
  test('Fetch all tasks (200 OK)', (done) => {
    axios.get('/tasks').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTasks);
      done();
    });
  });

  test('Fetch task (200 OK)', (done) => {
    axios.get('/tasks/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTasks[0]);
      done();
    });
  });

  test('Fetch task (404 Not Found)', (done) => {
    axios
      .get('/tasks/4')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new task (POST)', () => {
  test('Create new task (200 OK)', (done) => {
    axios.post('/tasks', { title: 'Ny oppgave' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ id: 4 });
      done();
    });
  });
});

describe('Delete task (DELETE)', () => {
  test('Delete task (200 OK)', (done) => {
    axios.delete('/tasks/2').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});
