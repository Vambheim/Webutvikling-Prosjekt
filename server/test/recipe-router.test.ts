import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import recipeService, { Ingredient, Recipe, RecipeIngredient, Step } from '../src/recipe-service';
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

//denne må sjekkes ut
const testUser: User = {
  user_id: 1,
  email: 'test@mail',
  first_name: 'Test',
  last_name: 'Testerson',
  password: '123',
};

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
        .then(() => done());
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
      .post('/recipes', { name: 'new recipe', country: 'new country', category: 'new category' })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({ recipe_id: 4 });
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

  test('Edit recipe (400 bad request)', (done) => {
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

  //Se over:
  test.skip('Edit step (400 bad request)', (done) => {
    axios.put('/recipes/1/steps/5', { order_number: 1, description: '' }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });

  test.skip('Edit step (500 internal server error) via a currently non-existing recipe_id ', (done) => {
    axios
      .put('/recipes/1/steps/1', {
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
  test.skip('Create new step (200 OK)', (done) => {
    axios.post('/ingredients', { name: 'new ingredient' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ ingredient_id: 5 });
      done();
    });
  });
});

////////////RECIPEINGREDIENT

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
