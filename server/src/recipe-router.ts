import express from 'express';
import recipeService from './recipe-service';
import bcrypt from 'bcryptjs';

/**
 * Express router containing task methods.
 */
const router = express.Router();
var salt = bcrypt.genSaltSync(10);

router.get('/login/:email/:password', (request, response) => {
  const email = String(request.params.email);
  const password = String(request.params.password);
  // flere sjekker ?
  //kanskje typeof = string ?
  if (email.length > 0 && password.length > 0) {
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
  } else {
    response.status(400).send('Please enter email and password');
  }
});


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

router.get('/ingredients', (_request, response) => {
  recipeService
    .getAllIngredients()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

//Example request params: { country: "China" }
//Example request params: { category: "Asian" }
//Example request params: { ingredient: "Carrot" }
router.get('/recipes/:country/:category/:ingredient', (request, response) => {
  // vurdere å endre sti til "recipes/filter" ? og data = request.body
  const country = String(request.params.country);
  const category = String(request.params.category);
  const ingredient = String(request.params.ingredient);
  if (country && category && ingredient) {
    recipeService
      .getFilteredRecipe(country, category, ingredient)
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  }
});

router.post('/recipes', (request, response) => {
  const data = request.body;
  if (data && data.name != 0 && data.category != 0 && data.country != 0)
    recipeService
      .create(data.name, data.category, data.country)
      .then((recipe_id) => response.send({ recipe_id: recipe_id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing recipe details');
});

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

router.delete('/recipes/:id', (request, response) => {
  recipeService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
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
