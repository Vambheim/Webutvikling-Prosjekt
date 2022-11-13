import express, { request, response } from 'express';
import recipeService from './recipe-service';
import bcrypt from 'bcryptjs';
import userService from './user-service';
import shoppingListService from './shoppingList-service';

/**
 * Express router containing task methods.
 */
const router = express.Router();
var salt = bcrypt.genSaltSync(10);

///////////////////USER
router.get('/login/:email/:password', (request, response) => {
  const email = String(request.params.email);
  const password = String(request.params.password);
  userService
    .getUser(email)
    .then((user) => {
      if (bcrypt.compareSync(password, String(user.password))) {
        response.send(user);
        return;
      } else {
        response.status(400).send('Incorrect Email and/or Password! ');
        return;
      }
    })
    .catch((error) => {
      response.status(500).send(error);
      return;
    });
});

router.post('/user/add', (request, response) => {
  const data = request.body;
  //Check required fields
  if (!data.first_name || !data.last_name || !data.email || !data.password || !data.password2) {
    response.send('Please fill in all the fields');
    return;
  }
  //Check passwords match
  if (data.password != data.password2) {
    response.send('Passwords does not match, please try again');
    return;
  }

  //Check if email-adress has @
  if (data.email.includes('@')) {
    userService
      .userExistsCheck(data.email)
      .then(() => {
        bcrypt.hash(data.password, salt, (error, hash) => {
          if (error) throw error;
          data.password = hash;
          userService
            .createUser(data.email, data.first_name, data.last_name, data.password)
            .then((rows) => response.send(rows))
            .catch((error) => response.status(500).send(error));
          return;
        });
      })
      .catch(() => response.send('Email: ' + data.email + ' is already in use'));
    return;
  } else {
    response.send('Not a valid email address');
    return;
  }
});

router.get('/likedRecipes/:user_id', (request, response) => {
  const user_id = Number(request.params.user_id);
  recipeService
    .getLikedRecipes(user_id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

///////////////////RECIPES
router.get('/recipes', (_request, response) => {
  recipeService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.get('/recipes/:recipe_id', (request, response) => {
  const recipe_id = Number(request.params.recipe_id);
  recipeService
    .get(recipe_id)
    .then((recipe) =>
      recipe ? response.send(recipe) : response.status(404).send('Recipe not found')
    )
    .catch((error) => response.status(500).send(error));
});

router.get('/recipes/:recipe_id/steps', (request, response) => {
  const recipe_id = Number(request.params.recipe_id);
  recipeService
    .getSteps(recipe_id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.get('/recipes/:recipe_id/ingredients', (request, response) => {
  const recipe_id = Number(request.params.recipe_id);
  recipeService
    .getIngredientsToRecipe(recipe_id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.post('/recipes', (request, response) => {
  const data = request.body;
  if (data && data.name != 0 && data.category != 0 && data.country != 0)
    recipeService
      .createRecipe(data.name, data.category, data.country)
      .then((recipe_id) => response.send({ recipe_id: recipe_id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing recipe details');
});

router.post('/recipes/ingredients', (request, response) => {
  const data = request.body;
  if (
    // se over denne
    typeof data.name == 'string' &&
    data.name.length != 0 &&
    typeof data.recipe_id == 'number' &&
    data.recipe_id.length != 0 &&
    typeof data.amount_per_person == 'number' &&
    data.amount_per_person.length != 0 &&
    typeof data.measurement_unit == 'string'
  ) {
    //Check if ingredient exists in the database to avoid redundancy
    recipeService
      .ingredientExistsCheck(data.name.toLowerCase())
      .then((existing_ingredient) => {
        // code that runs if the ingredient does exist in the table: ingredient
        recipeService
          //Creates a new row in the table: recipe_ingredient with the ingredient_id from the ingredientExistCheck
          .createRecipeIngredient(
            existing_ingredient.ingredient_id,
            data.recipe_id,
            data.amount_per_person,
            data.measurement_unit
          )
          .then(() => response.send('Created with existing ingredient'))
          .catch((error) => response.status(500).send(error));
      })
      .catch((error) => {
        if (error) {
          response.status(500).send(error);
        } else {
          // code that runs if the ingredient does not exist in the table: ingredient
          recipeService
            // makes sure the check is done with input in lower case
            .createIngredient(data.name.toLowerCase())
            .then((new_ingredient_id) => {
              response.send('New ingredient made');
              recipeService
                //Creates a new row in the table: recipe_ingredient with the newly made ingredient_id
                .createRecipeIngredient(
                  new_ingredient_id,
                  data.recipe_id,
                  data.amount_per_person,
                  data.measurement_unit
                )
                .then(() => response.send('Created with new ingredient'))
                .catch((error) => response.status(500).send(error));
            })
            .catch((error) => response.status(500).send(error));
        }
      });
  } else {
    response.status(400).send('Propperties are not valid');
  }
});

//Her må det legges til "/:recipe_id"
router.put('/recipes', (request, response) => {
  const data = request.body;
  if (
    typeof data.recipe_id == 'number' &&
    data.recipe_id.length != 0 &&
    typeof data.name == 'string' &&
    data.name.length != 0 &&
    typeof data.category == 'string' &&
    data.category.length != 0 &&
    typeof data.country == 'string' &&
    data.country.length != 0
  )
    recipeService
      .update({
        recipe_id: data.recipe_id,
        name: data.name,
        category: data.category,
        country: data.country,
      })
      .then(() => response.send('Recipe was updated'))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Propperties are not valid');
});

//Updates a given step in a given recipe
router.put('/recipes/:recipe_id/steps/:step_id', (request, response) => {
  const data = request.body;
  const recipe_id = Number(request.params.recipe_id);
  const step_id = Number(request.params.step_id);

  if (data && recipe_id && step_id) {
    recipeService
      .updateSteps(data.order_number, data.description, step_id, recipe_id)
      .then(() => response.send('Step was updated'))
      .catch((error) => response.status(500).send(error));
  }
});

// Updates a given ingredient in a given recipe
router.put('/recipes/:recipe_id/ingredients/:ingredient_id', (request, response) => {
  const data = request.body;
  const recipe_id = Number(request.params.recipe_id);
  const ingredient_id = Number(request.params.ingredient_id);

  //må se over denne, fungerer ikke med data.amount_per_person.length != 0
  if (data) {
    recipeService
      // makes sure the check is done with input in lower case
      .ingredientExistsCheck(data.name.toLowerCase())
      .then((existing_ingredient) => {
        // code that runs if the ingredient does exist in the table: ingredient
        recipeService
          //deletes the old row in the table: recipe_ingredient
          .deleteRecipeIngredient(ingredient_id, recipe_id)
          .then(() => {
            recipeService
              //Creates a new row in the table: recipe_ingredient with the ingredient_id from the ingredientExistCheck
              .createRecipeIngredient(
                existing_ingredient.ingredient_id,
                recipe_id,
                data.amount_per_person,
                data.measurement_unit
              )
              .then(() => response.send('Updated with existing ingredient'))
              .catch((error) => response.status(500).send(error));
          })
          .catch((error) => response.status(500).send(error));
      })
      .catch((error) => {
        //sends error if error from ingredientExistsCheck
        if (error) {
          response.status(500).send(error);
          return;
        } else {
          // code that runs if the ingredient does not exist in the table: ingredient
          recipeService
            // makes sure the check is done with input in lower case
            .createIngredient(data.name.toLowerCase())
            .then((new_ingredient_id) => {
              response.send('New ingredient made');
              recipeService
                //deletes the old row in the tabel: recipe_ingredient
                .deleteRecipeIngredient(ingredient_id, recipe_id)
                .then(() => {
                  recipeService
                    //Creates a new row in the table: recipe_ingredient with the newly made ingredient_id
                    .createRecipeIngredient(
                      new_ingredient_id,
                      recipe_id,
                      data.amount_per_person,
                      data.measurement_unit
                    )
                    .then(() => response.send('Updated with new ingredient'))
                    .catch((error) => response.status(500).send(error));
                })
                .catch((error) => response.status(500).send(error));
            })
            .catch((error) => response.status(500).send(error));
        }
      });
  } else {
    response.status(400).send('Propperties are not valid');
  }
});

router.delete('/recipes/:id', (request, response) => {
  recipeService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

// Creates a like in the database
router.post('/recipes/like', (request, response) => {
  const data = request.body;
  if (data && data.user_id != 0 && data.recipe_id != 0) {
    recipeService
      .likeRecipe(data.user_id, data.recipe_id)
      .then((_results) => response.send('Recipe was liked'))
      .catch((error) => response.status(500).send(error));
  } else response.status(400).send('wrong parameters');
});

router.get('/recipes/:recipe_id/recommended/:category/:country', (request, response) => {
  const recipe_id = Number(request.params.recipe_id);
  const category = String(request.params.category);
  const country = String(request.params.country);
  recipeService
    .getRecomendedRecipes(recipe_id, category, country)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

//////////////////INGREDIENTS
router.get('/ingredients', (_request, response) => {
  recipeService
    .getAllIngredients()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.post('/ingredients', (request, response) => {
  const data = request.body;
  if (typeof data.name == 'string' && data.name.length != 0) {
    recipeService
      .createIngredient(data.name)
      .then((ingredient_id) => response.send({ ingredient_id: ingredient_id }))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Propperties are not valid');
  }
});

/////////////Steps
router.post('/steps', (request, response) => {
  const data = request.body;
  if (
    typeof data.order_number == 'number' &&
    data.order_number.length != 0 &&
    typeof data.description == 'string' &&
    data.description.length != 0 &&
    typeof data.recipe_id == 'number' &&
    data.recipe_id.length != 0
  ) {
    recipeService
      .createStep(data.order_number, data.description, data.recipe_id)
      .then(() => response.send('Added successfully'))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Propperties are not valid');
  }
});

///////////////////FILTER

router.get('/oneingredientfilter/:ingredient1', (request, response) => {
  const ingredient1 = String(request.params.ingredient1);
  if (typeof ingredient1 == 'string' && ingredient1.length != 0) {
    recipeService
      .getFilterByIngredients(ingredient1, '', '', 1)
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Propperties are not valid');
  }
});

router.get('/twoingredientsfilter/:ingredient1/:ingredient2', (request, response) => {
  const ingredient1 = String(request.params.ingredient1);
  const ingredient2 = String(request.params.ingredient2);
  if (
    typeof ingredient1 == 'string' &&
    typeof ingredient2 == 'string' &&
    ingredient1.length != 0 &&
    ingredient2.length != 0
  ) {
    recipeService
      .getFilterByIngredients(ingredient1, ingredient2, '', 2)
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Propperties are not valid');
  }
});

router.get(
  '/threeingredientsfilter/:ingredient1/:ingredient2/:ingredient3',
  (request, response) => {
    const ingredient1 = String(request.params.ingredient1);
    const ingredient2 = String(request.params.ingredient2);
    const ingredient3 = String(request.params.ingredient3);
    if (
      typeof ingredient1 == 'string' &&
      typeof ingredient2 == 'string' &&
      typeof ingredient3 == 'string' &&
      ingredient1.length != 0 &&
      ingredient2.length != 0 &&
      ingredient3.length != 0
    ) {
      recipeService
        .getFilterByIngredients(ingredient1, ingredient2, ingredient3, 3)
        .then((rows) => response.send(rows))
        .catch((error) => response.status(500).send(error));
    } else {
      response.status(400).send('Propperties are not valid');
    }
  }
);

router.get('/countryandcategoryfilter/:country/:category', (request, response) => {
  const country = String(request.params.country);
  const category = String(request.params.category);
  if (country && category) {
    recipeService
      .getFilterByCountryAndCategory(country, category)
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  }
});

router.get('/countryfilter/:country', (request, response) => {
  const country = String(request.params.country);
  if (country) {
    recipeService
      .getFilterByCountry(country)
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  }
});

router.get('/categoryfilter/:category', (request, response) => {
  const category = String(request.params.category);
  if (category) {
    recipeService
      .getFilterByCategory(category)
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  }
});

/////////////////////SHOPPING LIST
router.get('/shoppinglist/:user_id', (request, response) => {
  const user_id = Number(request.params.user_id);
  shoppingListService
    .getShoppingList(user_id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.post('/shoppinglist', (request, response) => {
  const data = request.body;
  if (
    data &&
    data.recipe_id != 0 &&
    data.ingredient_id != 0 &&
    data.user_id != 0 &&
    data.amount != 0
  )
    shoppingListService
      .addToShoppingList(data)
      .then(() => response.send('Added to shopping list'))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing ingredient details');
});

router.delete('/shoppinglist/:user_id', (request, response) => {
  const user_id = Number(request.params.user_id);
  shoppingListService
    .deleteShoppingList(user_id)
    .then((_results) => response.send('Shopping list deleted'))
    .catch((error) => response.status(500).send(error));
});

router.delete('/shoppinglistitem/:shopping_list_id', (request, response) => {
  const shopping_list_id = Number(request.params.shopping_list_id);
  shoppingListService
    .deleteItemShoppingList(shopping_list_id)
    .then((_results) => response.send('Item in shopping list deleted'))
    .catch((error) => response.status(500).send(error));
});

// Poster spørring til tabell Recipe
router.post('/spoonacular/recipes', (request, response) => {
  var data = request.body;

  //Slicer request packingen og parser til JSON
  var json = JSON.stringify(data).slice(11, -1);
  var recipes = JSON.parse(json);

  if (data != null)
    recipeService
      .PostSpoonacularRecipes(recipes)
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
});

// Poster spørring til tabell Ingridient
router.post('/spoonacular/ingridients', (request, response) => {
  var data = request.body;

  //Slicer request packingen og parser til JSON
  var json = JSON.stringify(data).slice(15, -1);
  var ingridients = JSON.parse(json);

  if (data != null)
    recipeService
      .PostSpoonacularIngridients(ingridients)
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
});

//Poster spørring til tabell recipe_ingrident
router.post('/spoonacular/ingridients-recipes', (request, response) => {
  var data = request.body;

  //Slicer request packingen og parser til JSON
  var json = JSON.stringify(data).slice(15, -1);
  var ingridients = JSON.parse(json);

  if (data != null)
    recipeService
      .PostSpoonacularRecipesIngridients(ingridients)
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
});

//Poster spørring til tabell Step
router.post('/spoonacular/steps', (request, response) => {
  var data = request.body;
  //Slicer request packingen og parser til JSON
  var json = JSON.stringify(data).slice(9, -1);
  var steps = JSON.parse(json);

  if (data != null)
    recipeService
      .PostSpoonacularSteps(steps)
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
});

// Example request body: { title: "Ny oppgave" }
// // Example response body: { id: 4 }
// router.post('/tasks', (request, response) => {
//   const data = request.body;
//   if (data && data.title && data.title.length != 0)
//     taskService
//       .create(data.title)
//       .then((id) => response.send({ id: id }))
//       .catch((error) => response.status(500).send(error));
//   else response.status(400).send('Missing task title');
// });

// router.delete('/tasks/:id', (request, response) => {
//   taskService
//     .delete(Number(request.params.id))
//     .then((_result) => response.send())
//     .catch((error) => response.status(500).send(error));
// });

export default router;
