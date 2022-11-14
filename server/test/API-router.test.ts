import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import recipeService, { Ingredient, Recipe, RecipeIngredient } from '../src/recipe-service';
import shoppingListService, {
  ShoppingListInfo,
  ShoppingListUserInfo,
} from '../src/shoppingList-service';
import userService, { User } from '../src/user-service';

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

const testRecipeIngredients: RecipeIngredient[] = [
  { ingredient_id: 1, name: 'beans', recipe_id: 1, amount_per_person: 2, measurement_unit: 'cans' },
  {
    ingredient_id: 2,
    name: 'tomato',
    recipe_id: 1,
    amount_per_person: 4,
    measurement_unit: 'pieces',
  }, // til recipe 1 og 2
  {
    ingredient_id: 2,
    name: 'tomato',
    recipe_id: 2,
    amount_per_person: 1,
    measurement_unit: 'pack',
  }, // til recipe 1 og 2
  {
    ingredient_id: 3,
    name: 'flour',
    recipe_id: 2,
    amount_per_person: 500,
    measurement_unit: 'gram',
  }, // til recipe 2
  { ingredient_id: 4, name: 'onion', recipe_id: 3, amount_per_person: 6, measurement_unit: '' }, // til recipe 3 }
];

const testUser: User = {
  user_id: 1,
  email: 'test@mail',
  first_name: 'Test',
  last_name: 'Testerson',
  password: '123abc',
};
const password2: string = '123abc';

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
  // Delete all users, and reset user_id auto-increment start value
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

  // Delete all recipes, and reset recipe_id auto-increment start value
  pool.query('DELETE FROM recipe', (error) => {
    if (error) return done(error);
    //resets the auto_increment
    pool.query('ALTER TABLE recipe AUTO_INCREMENT = 1', (error) => {
      if (error) return done(error);
      testRecipes.map((testRecipe) => {
        recipeService.createRecipe(testRecipe.name, testRecipe.country, testRecipe.category);
      });
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
        .then(() => {
          testRecipeIngredients.map((data) => {
            recipeService.createRecipeIngredient(
              data.ingredient_id,
              data.recipe_id,
              data.amount_per_person,
              data.measurement_unit
            );
          });
        })
        .then(() => done());
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
describe('Test log in (GET)', () => {
  test('Log in (200 OK)', (done) => {
    axios.get('/users/login/test@mail/123abc').then((response) => {
      // expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUser);
      done();
    });
  });

  test('Wrong password (400 bad request)', (done) => {
    axios.get('/users/login/test@mail/fakePassword').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });

  test('No user or password (404 Not Found)', (done) => {
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
