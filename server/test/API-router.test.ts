import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import recipeService, { Ingredient, Recipe } from '../src/recipe-service';
import shoppingListService, {
  ShoppingListInfo,
  ShoppingListUserInfo,
} from '../src/shoppingList-service';

const testRecipes: Recipe[] = [
  { recipe_id: 1, name: 'Chili con carne', category: 'stew', country: 'Mexico' },
  { recipe_id: 2, name: 'Pizza', category: 'dinner', country: 'Italy' },
  { recipe_id: 3, name: 'Onion soup', category: 'soup', country: 'France' },
];

const testIngredients: Ingredient[] = [
  { ingredient_id: 1, name: 'beans' }, //til recipe 1
  { ingredient_id: 2, name: 'tomato' }, // til recipe 1 og 2
  { ingredient_id: 3, name: 'flour' }, // til recipe 2
  { ingredient_id: 4, name: 'onion' }, // til recipe 3
];

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

      // Create testRecipes sequentially in order to set correct recipe_id, and call done() when finished
      recipeService
        //kanskje mappe denne?
        .createRecipe(testRecipes[0].name, testRecipes[0].country, testRecipes[0].category)
        .then(() =>
          recipeService.createRecipe(
            testRecipes[1].name,
            testRecipes[1].country,
            testRecipes[1].category
          )
        ) // Create testTask[1] after testTask[0] has been created
        .then(() =>
          recipeService.createRecipe(
            testRecipes[2].name,
            testRecipes[2].country,
            testRecipes[2].category
          )
        ); // Create testRecipes[2] after testRecipes[1] has been created
      // .then(() => done()); // Call done() after testRecipes[2] has been created
    });
  });

  pool.query('DELETE FROM ingredient', (error) => {
    if (error) return done(error);
    //resets the auto_increment
    pool.query('ALTER TABLE ingredient AUTO_INCREMENT = 1', (error) => {
      if (error) return done(error);
      recipeService
        .createIngredient(testIngredients[0].name)
        .then(() => recipeService.createIngredient(testIngredients[1].name))
        .then(() => recipeService.createIngredient(testIngredients[2].name))
        .then(() => recipeService.createIngredient(testIngredients[3].name))
        .then(() => done()); // Call done() after testRecipes[2] has been created
    });
  });

  // pool.query('DELETE FROM shopping_list', (error) => {
  //   if (error) return done(error);
  //   //resets the auto_increment
  //   pool.query('ALTER TABLE shopping_list AUTO_INCREMENT = 1', (error) => {
  //     if (error) return done(error);
  //     shoppingListService.addToShoppingList(testShoppingListUser).then(() => done()); // Call done() after testRecipes[2] has been created
  //   });
  // });
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

////////////INGREDIENTS
describe('Fetch ingredients (GET)', () => {
  test('Fetch all ingredients (200 OK)', (done) => {
    axios.get('/ingredients').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testIngredients);
      done();
    });
  });
});

describe('Create new ingredient (POST)', () => {
  test('Create new ingredient (200 OK)', (done) => {
    axios.post('/ingredients', { name: 'new ingredient' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ ingredient_id: 5 });
      done();
    });
  });

  test('Create new ingredient (400 bad request)', (done) => {
    axios.post('/ingredients', { name: '' }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });
});

////////////RECIPE INGREDIENT


////////////USER

////////////SHOPPING LIST

// describe('Fetch shopping list (GET)', () => {
//   test('Fetch shopping list (200 OK)', (done) => {
//     axios.get('/shoppinglist/:user_id').then((response) => {
//       expect(response.status).toEqual(200);
//       expect(response.data).toEqual(testShoppingListInfo);
//       done();
//     });
//   });
// });
