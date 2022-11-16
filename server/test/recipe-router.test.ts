import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import recipeService, { Ingredient, Recipe, RecipeIngredient, Step } from '../src/recipe-service';
import userService, { User } from '../src/user-service';
import shoppingListService, {
  ShoppingListUserInfo,
  ShoppingListInfo,
} from '../src/shoppingList-service';
import { salt } from '../src/API-router';
import bcrypt from 'bcryptjs';

const testRecipes: Recipe[] = [
  { recipe_id: 1, name: 'Chili con carne', category: 'stew', country: 'Mexico' },
  { recipe_id: 2, name: 'Pizza', category: 'dinner', country: 'Italy' },
  { recipe_id: 3, name: 'Pasta', category: 'dinner', country: 'Italy' },
  { recipe_id: 4, name: 'No ingredients', category: 'empty', country: 'empty' },
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
  { ingredient_id: 4, name: 'onion', recipe_id: 1, amount_per_person: 6, measurement_unit: '' }, // til recipe 1 }
];

//denne må sjekkes ut
const testUser: User = {
  user_id: 1,
  email: 'test@mail',
  first_name: 'Test',
  last_name: 'Testerson',
  password: '123',
};

const testShoppingListUser: ShoppingListUserInfo[] = [
  { recipe_id: 1, ingredient_id: 1, user_id: 1, amount: 2, measurement_unit: 'cans' },
  { recipe_id: 1, ingredient_id: 2, user_id: 1, amount: 4, measurement_unit: 'pieces' },
];

const testShoppingListInfo: ShoppingListInfo[] = [
  {
    shopping_list_id: 1,
    recipe_id: 1,
    ingredient_id: 1,
    name: 'beans',
    amount: 2,
    measurement_unit: 'cans',
  },
  {
    shopping_list_id: 2,
    recipe_id: 1,
    ingredient_id: 2,
    name: 'tomato',
    amount: 4,
    measurement_unit: 'pieces',
  },
];

const testSteps: Step[] = [
  {
    step_id: 1,
    order_number: 1,
    description: 'Mix flour, water and yeast together',
    recipe_id: 2,
  },

  { step_id: 2, order_number: 2, description: 'let the dough rest', recipe_id: 2 },

  { step_id: 3, order_number: 1, description: 'Peel and chop onions', recipe_id: 3 },
  { step_id: 4, order_number: 2, description: 'Caramlize the onions in a pan', recipe_id: 3 },

  { step_id: 5, order_number: 1, description: 'Chop chili', recipe_id: 1 },

  { step_id: 6, order_number: 2, description: 'Mix tomatosauce and beans together', recipe_id: 1 },
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  bcrypt.hash(testUser.password, salt, (error, hash) => {
    if (error) throw error;
    testUser.password = hash;
  });
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
      testRecipes.map((testRecipe) => {
        recipeService.createRecipe(testRecipe.name, testRecipe.country, testRecipe.category);
      });
    });
  });

  pool.query('DELETE FROM step', (error) => {
    if (error) return done(error);
    //resets the auto_increment
    pool.query('ALTER TABLE step AUTO_INCREMENT = 1', (error) => {
      if (error) return done(error);
      testSteps.map((testStep) => {
        recipeService.createStep(testStep.order_number, testStep.description, testStep.recipe_id);
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
        .then(() => {
          pool.query('DELETE FROM user', (error) => {
            if (error) return done(error);
            pool.query('ALTER TABLE user AUTO_INCREMENT = 1', (error) => {
              if (error) return done(error);

              userService
                .createUser(
                  testUser.email,
                  testUser.first_name,
                  testUser.last_name,
                  testUser.password
                )
                .then(() => {
                  recipeService.likeRecipe(1, 2).then(() => {
                    recipeService.likeRecipe(1, 3);
                  });
                })
                .then(() => {
                  pool.query('DELETE FROM shopping_list', (error) => {
                    if (error) return done(error);
                    pool.query('ALTER TABLE shopping_list AUTO_INCREMENT = 1', (error) => {
                      if (error) return done(error);
                      shoppingListService
                        .addToShoppingList(testShoppingListUser[0])
                        .then(() => {
                          shoppingListService.addToShoppingList(testShoppingListUser[1]);
                        })
                        .then(() => done());
                    });
                  });
                });
            });
          });
        });
    });
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

////RECIPE
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

  test('Fetch recipe (404 Not Found) via wrong path to a recipe that does not exists', (done) => {
    axios
      .get('/recipes/9')
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
      .post('/recipes', { name: 'new recipe', country: 'new country', category: 'new category' })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({ recipe_id: 5 });
        done();
      });
  });

  test('Create new recipe (400 bad request) without necesary input', (done) => {
    axios.post('/recipes', { name: 'new recipe' }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');

      done();
    });
  });

  test('Create new recipe (404 not found) via a path that does not exists', (done) => {
    axios
      .post('/unknownPath', {
        name: 'new recipe',
        country: 'new country in Norwegian',
        category: 'new category',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');

        done();
      });
  });

  test('Create new recipe (500 internal server error) too large input', (done) => {
    axios
      .post('/recipes', {
        //Since the column-type "name" is defined as Varchar(50) in the database,
        //input that exceeds this limit will return a 500 internal server error.
        //Given that the if-statement of router.post in API-roter checks if the input
        //is of a valid type (string) and !=0, it will not be sufficient to aasign a number to the name-varibale
        //as it will return an error code of 400 and not 500.
        name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        country: 'new country',
        category: 'new category',
      })

      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 500');

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

  test('Delete recipe (404 not found) via a unknown path', (done) => {
    axios.delete('/unknownPath/1').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 404');
      done();
    });
  });

  test('Delete recipe (400 bad request) with input that is 0', (done) => {
    axios.delete('/recipes/0').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });

  test('Delete recipe (500 internal server error) when deleting a recipe that does not exist', (done) => {
    axios.delete('/recipes/20').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 500');
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
        country: 'edited country',
        category: 'edited category',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      });
  });

  test('Edit recipe (400 bad request) without necesary (country-) input', (done) => {
    axios
      .put('/recipes', {
        recipe_id: 1,
        name: 'edited recipename',
        category: 'edited category',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });

  test('Edit recipe (404 not found) via a non-currently existing path', (done) => {
    axios
      .put('/recipessss', {
        recipe_id: 1,
        name: 'edited recipename',
        country: 'edited country',
        category: 'edited category',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });

  test('Edit recipe (500 internal server error)', (done) => {
    axios
      .put('/recipes', {
        recipe_id: 1,
        name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        country: 'edited country',
        category: 'edited category',
      })

      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 500');
        done();
      });
  });
});

////////////STEPS

describe('Fetch steps (GET)', () => {
  test('Fetch all steps (200 OK) for the recipe with recipe_id = 1 ', (done) => {
    axios.get('/recipes/1/steps').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testSteps[4], testSteps[5]]);
      done();
    });
  });

  test('Fetch all steps (500 Internal Server Error) ', (done) => {
    axios.get('/recipes/wrongrecipeid/steps').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 500');
      done();
    });
  });
});

describe('Edit step (PUT)', () => {
  test('Edit step (200 OK)', (done) => {
    axios
      .put('/recipes/1/steps/4', {
        order_number: 1,
        description: 'Edited description',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      });
  });

  test('Edit step (404 not found) via unknown path', (done) => {
    axios
      .put('/unknownPath/2/steps/1', {
        order_number: 1,
        description: 'Edited description',
      })

      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });

  test('Edit step (400 bad request) in terms of missing description-input', (done) => {
    axios
      .put('/recipes/2/steps/2', { order_number: 1 })
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });

  test('Edit step with wrong recipeid (500 internal server error)', (done) => {
    axios
      .put('/recipes/wrongrecipeid/steps/5', {
        order_number: 1,
        description: 'Edited description',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 500');
        done();
      });
  });
});

describe('Create new step (POST)', () => {
  test('Create new step (200 OK)', (done) => {
    axios
      .post('/steps', { order_number: 3, description: 'new description', recipe_id: 3 })
      .then((response) => {
        expect(response.status).toEqual(200);
        //Er det under nøvendig/relevant å ha med?
        expect(response.data).toEqual('Step added successfully');
        done();
      });
  });

  test('Create new step (400 bad reequest) with wrong inputype regarding order_number (string) ', (done) => {
    axios
      .post('/steps', { order_number: '1', description: 'new description', recipe_id: 3 })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });

  test('Create new step (404 not found) via a udefined redirected path ', (done) => {
    axios
      .post('/add/steps', {
        order_number: 1,
        description: 'new description',
        recipe_id: 3,
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });

  test('Create new step (500 internal server error) with input that exceedes the column-value-type of VARCHAR(500) in the database', (done) => {
    axios
      .post('/steps', {
        order_number: 10,
        description:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        recipe_id: 1,
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 500');
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

////////////RECIPEINGREDIENT
describe('Fetch recipeIngredients (GET)', () => {
  test('Fetch all recipeIngredients (200 OK)', (done) => {
    axios.get('/recipes/1/ingredients').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([
        testRecipeIngredients[0],
        testRecipeIngredients[1],
        testRecipeIngredients[4],
      ]);
      done();
    });
  });

  test('Fetch all recipeIngredients (400 bad request) with invalid recipe_id-input of 0', (done) => {
    axios.get('/recipes/0/ingredients/').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });

  test('Fetch all recipeIngredients (404 not found) via a invalid path', (done) => {
    axios.get('/invalidPath/1/ingredients/').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 404');
      done();
    });
  });

  //teste sjekken på denne i API-router.ts
  test('Fetch all recipeIngredients (500 internal server error) with invalidDBinput of type string', (done) => {
    axios.get('/recipes/invalidDBInput/ingredients/').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 500');
      done();
    });
  });
});

describe('Update recipeIngredients (PUT)', () => {
  test('Edit recipeIngredients (200 OK)', (done) => {
    axios
      .put('/recipes/1/ingredients/1', {
        amount_per_person: 1,
        measurement_unit: 'edited measurement_unit',
        name: 'edited ingredient_name',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual('Updated with new ingredient');
        done();
      });
  });
  test('Edit recipeIngredients (400 bad request) in terms missing necesary input/propperties', (done) => {
    axios
      .put('/recipes/1/ingredients/1', {
        amount_per_person: 1,
        measurement_unit: 'Edited measurement_unit',
      })

      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });

  test('Edit recipeIngredients (404 not found) in terms of a unknown path', (done) => {
    axios
      .put('/recipes/1/uknownPath/1', {
        amount_per_person: 1,
        measurement_unit: 'Edited measurement_unit',
        name: 'Edited name',
      })

      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });

  test('Edit recipeIngredients (500 internal server error) in terms of too large input for the column-type', (done) => {
    axios
      .put('/recipes/1/ingredients/1', {
        amount_per_person: 1,
        measurement_unit: 'Edited measurement_unit',
        name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      })

      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 500');
        done();
      });
  });
});

describe('Create new recipeIngredient (POST)', () => {
  test('Create new recipeIngredient (200 OK)', (done) => {
    axios
      .post('/recipes/ingredients', {
        name: 'New ingredient',
        recipe_id: 4,
        amount_per_person: 40,
        measurement_unit: 'gram',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual('Created with new ingredient');
        done();
      });
  });

  test('Create new recipeIngredient (400 bad request) regarding missing input', (done) => {
    axios
      .post('/recipes/ingredients', {
        recipe_id: 4,
        amount_per_person: 40,
        measurement_unit: 'gram',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });
  test('Create new recipeIngredient (404 not found) via uknown path', (done) => {
    axios
      .post('/unknownPath/ingredients', {
        name: 'New ingredient',
        recipe_id: 4,
        amount_per_person: 40,
        measurement_unit: 'gram',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');

        done();
      });
  });
});

///////////////SHOPPING LIST
describe('Fetch shopping list (GET)', () => {
  test('Fetch shopping list (200 OK)', (done) => {
    axios.get('/shoppinglist/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testShoppingListInfo[0], testShoppingListInfo[1]]);
      done();
    });
  });
});

describe('Add to shopping list (POST)', () => {
  test('Add ingredient to shopping list (200 OK)', (done) => {
    axios
      .post('/shoppinglist', {
        recipe_id: 1,
        ingredient_id: 1,
        user_id: 1,
        amount: 2,
      })
      .then((response) => {
        expect(response.data).toEqual('Added to shopping list');
        done();
      });
  });

  test('Add ingredient to shopping list with wrong input (400 bad request)', (done) => {
    axios
      .post('/shoppinglist', {
        recipe_id: '',
        ingredient_id: '',
        user_id: '',
        amount: '',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });

  test('Add ingredient to shopping list (500 Internal Server Error)', (done) => {
    axios
      .post('/shoppinglist', {
        recipe_id: 'ONE',
        ingredient_id: 1,
        user_id: 1,
        amount: 2,
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 500');
        done();
      });
  });
});

describe('Delete from shopping list (DELETE)', () => {
  test('Delete all items from shopping list (200 OK)', (done) => {
    axios.delete('/shoppinglist/1').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });

  test('Delete all items from shopping list (500 Internal Server Error)', (done) => {
    axios.delete('/shoppinglist/99').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 500');
      done();
    });
  });

  test('Delete one item from shopping list (200 OK)', (done) => {
    axios.delete('/shoppinglistitem/1').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });

  test('Delete one item from shopping list (500 Internal Server Error)', (done) => {
    axios.delete('/shoppinglistitem/99').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 500');
      done();
    });
  });
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
  test('Log in (200 OK)', (done) => {
    axios.get('/users/login/test@mail/123').then((response) => {
      expect(response.status).toEqual(200);
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

/////////FILTERS
describe('Fetch filtered recipes by ingredients (GET)', () => {
  test('Fetch recipes filtered by one ingredient (200 OK)', (done) => {
    axios.get('/oneingredientfilter/tomato').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipes[0], testRecipes[1]]);
      done();
    });
  });

  test('Fetch recipes filtered by one ingredient (404 bad request) via unknown path', (done) => {
    axios.get('/uknownPath/tomato').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 404');
      done();
    });
  });

  // IMPOSSIBLE TO CATCH BOTH 400 AND 500 ERROR GIVING THE INPUT AND IF-CHECKS IN API ROUTER
  //--------------------------------------------------------------------------------------------
  // test('Fetch recipes filtered by one ingredient (500 internal server error) trying to extract ingredientname with wrong datatype (number) ', (done) => {
  //   axios.get('/oneingredientfilter/1').catch((error) => {
  //     expect(error.message).toEqual('Request failed with status code 500');
  //
  //       done();
  //     });
  //   });
  //
  //   test('Fetch recipes filtered by one ingredient (400 bad request) with missing input (":ingredient1")', (done) => {
  //     axios.get('/oneingredientfilter/ ').catch((error) => {
  //       expect(error.message).toEqual('Request failed with status code 400');
  //
  //      done();
  //     });
  //   });

  test('Fetch recipes filtered by two ingredient (200 OK)', (done) => {
    axios.get('/twoingredientsfilter/tomato/beans').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipes[0]]);
      done();
    });
  });

  test('Fetch recipes filtered by one ingredient (404 bad request) via unknown path', (done) => {
    axios.get('/uknownpath/tomatp/beans').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 404');
      done();
    });
  });

  test('Fetch recipes filtered by two ingredients (200 OK)', (done) => {
    axios.get('/threeingredientsfilter/tomato/beans/onion').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipes[0]]);
      done();
    });
  });

  test('Fetch recipes filtered by three ingredients (404 bad request) via unknown path', (done) => {
    axios.get('/uknownpath/tomatp/beans/onion').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 404');

      done();
    });
  });
});

describe('Fetch filtered recipes by country and/or category (GET)', () => {
  test('Fetch recipes filtered by category (200 OK)', (done) => {
    axios.get('/categoryfilter/stew').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipes[0]]);
      done();
    });
  });

  test('Fetch recipes filtered by country (200 OK)', (done) => {
    axios.get('/countryfilter/Mexico').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipes[0]]);
      done();
    });
  });

  test('Fetch recipes filtered by both country and category (200 OK)', (done) => {
    axios.get('/countryandcategoryfilter/Mexico/stew').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipes[0]]);
      done();
    });
  });
});

///////LIKES
describe('Create likes for a given recipe (POST)', () => {
  test('Create like for a given recipe (200 ok)', (done) => {
    axios.post('/recipes/like', { user_id: 1, recipe_id: 1 }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual('Recipe was liked');

      done();
    });
  });
});

describe('Get likes recipes (GET)', () => {
  test('Get likes recipes (200 ok)', (done) => {
    axios.get('/likedRecipes/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipes[1], testRecipes[2]]);

      done();
    });
  });

  test('Get likes recipes (500 internal server error)', (done) => {
    axios.get('/likedRecipes/nocurrentuser').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 500');

      done();
    });
  });
});

//////////////RECOMMENDED RECIPES
describe('Get recommended recipes (GET)', () => {
  test('Get recommended recipes (200 ok)', (done) => {
    axios.get('/recipes/2/recommended/dinner/Italy').then((response) => {
      // recipe id 2
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipes[2]]);

      done();
    });
  });

  test('Get recommended recipes with no current recipe_id (500 Internal Server Error)', (done) => {
    axios.get('/recipes/nocurrentrecipe/recommended/dinner/Italy').catch((error) => {
      // recipe id 2
      expect(error.message).toEqual('Request failed with status code 500');

      done();
    });
  });
});
