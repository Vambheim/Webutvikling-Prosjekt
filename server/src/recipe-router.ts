import express, { request, response } from 'express';
import recipeService from './recipe-service';
import bcrypt from 'bcryptjs';

/**
 * Express router containing task methods.
 */
const router = express.Router();
var salt = bcrypt.genSaltSync(10);

///////////////////USER
router.get('/login/:email/:password', (request, response) => {
  const email = String(request.params.email);
  const password = String(request.params.password);
  recipeService
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

// sjekke over denne når du får tid Thomas, kan ryddes mye tror jeg
router.post('/user/add', (request, response) => {
  const data = request.body;
  let errors = [];

  //Check required fields
  if (!data.first_name || !data.last_name || !data.email || !data.password || !data.password2) {
    errors.push({ msg: 'Please fill in all the fields' });
    response.send('Please fill in all the fields');
  }

  //Check passwords match
  if (data.password != data.password2) {
    errors.push({ msg: 'Passwords dont match' });
    response.send('Passwords does not match, please try again');
  }

  function register() {
    bcrypt.hash(data.password, salt, (error, hash) => {
      if (error) throw error;
      data.password = hash;
      // Store hash in your password DB.
      recipeService
        .createUser(data.email, data.first_name, data.last_name, data.password)
        .then((rows) => response.send(rows))
        .catch((error) => response.status(500).send(error));
      return;
    });
  }

  if (errors.length > 0) {
    response.send('Error found, please try again');
    return;
  } else {
    if (data.email.includes('@')) {
      recipeService
        .userExistsCheck(data.email)
        .then(() => register())
        .catch(() => response.send('Email: ' + data.email + ' is already in use'));
      return;
    } else {
      response.send('Not a valid email address');
      return;
    }
  }
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
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Propperties are not valid');
});

router.put('/recipes/:recipe_id/ingredients/:ingredient_id', (request, response) => {
  const data = request.body;
  const recipe_id = Number(request.params.recipe_id);
  const ingredient_id = Number(request.params.ingredient_id);

  if (
    typeof data.amount_per_person == 'string' &&
    data.amount_per_person.length != 0 &&
    typeof data.measurement_unit == 'string' &&
    data.measurement_unit != 0 &&
    typeof recipe_id == 'number' &&
    typeof ingredient_id == 'number'
  )
    recipeService
      .updateRecipeIngredients(
        data.amount_per_person,
        data.measurement_unit,
        ingredient_id,
        recipe_id
      )
      .then(() => response.send('Ingredient was updated'))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Propperties are not valid');
});

router.delete('/recipes/:id', (request, response) => {
  recipeService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

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

router.post('/recipe/ingredients', (request, response) => {
  const data = request.body;
  if (
    typeof data.ingredient_id == 'number' &&
    data.ingredient_id.length != 0 &&
    typeof data.recipe_id == 'number' &&
    data.recipe_id.length != 0 &&
    typeof data.amount_per_person == 'number' &&
    data.amount_per_person.length != 0 &&
    typeof data.measurement_unit == 'string'
  ) {
    recipeService
      .createRecipeIngredient(
        data.ingredient_id,
        data.recipe_id,
        data.amount_per_person,
        data.measurement_unit
      )
      .then(() => response.send('Added successfully'))
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

// router.get('/recipes/:country/:category/:ingredient', (request, response) => {
//   // vurdere å endre sti til "recipes/filter" ? og data = request.body
//   const country = String(request.params.country);
//   const category = String(request.params.category);
//   const ingredient = String(request.params.ingredient);
//   if (country && category && ingredient) {
//     recipeService
//       .getFilteredRecipe(country, category, ingredient)
//       .then((rows) => response.send(rows))
//       .catch((error) => response.status(500).send(error));
//   }
// });

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

/////////////////////SHOPPING LIST
router.get('/shoppinglist/:user_id', (request, response) => {
  const user_id = Number(request.params.user_id);
  recipeService
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
    recipeService
      .addToShoppingList(data)
      .then(() => response.send('Added to shopping list'))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing ingredient details');
});

router.delete('/shoppinglist/:user_id', (request, response) => {
  const user_id = Number(request.params.user_id);
  recipeService
    .deleteShoppingList(user_id)
    .then((_results) => response.send('Shopping list deleted'))
    .catch((error) => response.status(500).send(error));
});

router.delete('/shoppinglistitem/:shopping_list_id', (request, response) => {
  const shopping_list_id = Number(request.params.shopping_list_id);
  recipeService
    .deleteItemShoppingList(shopping_list_id)
    .then((_results) => response.send('Item in shopping list deleted'))
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
