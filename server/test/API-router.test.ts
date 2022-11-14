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

const testShoppingLists: ShoppingListInfo = {shopping_list_id: 1, recipe_id:1, ingredient_id:1, name:"beans", amount:2, measurement_unit:"cans"};
const testShoppingListUser: ShoppingListUserInfo = {}
// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all recipes, and reset recipe_id auto-increment start value
  pool.query('DELETE FROM recipe', (error) => {
    if (error) return done(error);
    //resets the auto_increment
    pool.query('ALTER TABLE recipe AUTO_INCREMENT = 1', (error) => {
      if (error) return done(error);

      // Create testTasks sequentially in order to set correct id, and call done() when finished
      // recipeService
      //   .create(testTasks[0].title)
      //   .then(() => taskService.create(testTasks[1].title)) // Create testTask[1] after testTask[0] has been created
      //   .then(() => taskService.create(testTasks[2].title)) // Create testTask[2] after testTask[1] has been created
      //   .then(() => done()); // Call done() after testTask[2] has been created

      testRecipes.map((testRecipe) => {
        recipeService.createRecipe(testRecipe.name, testRecipe.country, testRecipe.category);
      });

      done();
    });
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch recipes (GET)', () => {
  test('Fetch all recipes (200 OK)', (done) => {
    axios.get('/recipes').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testRecipes);
      done();
    });
  });

  test('Fetch recipe (200 OK)', (done) => {
    axios.get('/recipes/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testRecipes[0]);
      done();
    });
  });

  test('Fetch recipe (404 Not Found)', (done) => {
    axios
      .get('/recipes/4')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new recipe (POST)', () => {
  test('Create new recipe (200 OK)', (done) => {
    axios
      .post('/recipes', { name: 'new recipe', category: 'new category', country: 'new country' })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({ recipe_id: 4 });
        done();
      });
  });

  test('Create new recipe (400 bad request)', (done) => {
    axios.post('/recipes', { name: 'new recipe' }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');

      done();
    });
  });
});

describe('Delete recipe (DELETE)', () => {
  test('Delete recipe (200 OK)', (done) => {
    axios.delete('/recipes/2').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});

describe('Edit recipe (PUT)', () => {
  test('Edit recipe (200 OK)', (done) => {
    axios
      .put('/recipes', {
        recipe_id: 1,
        name: 'edited recipename',
        category: 'edited category',
        country: 'edited country',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      });
  });
});

////////////USER

////////////SHOPPING LIST
describe('Fetch shopping list (GET)', () => {
  test('Fetch shopping list (200 OK)', (done) => {
    axios.get('/shoppinglist/:user_id').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(ShoppingListInfo[]);
      done();
    });
  });
});


