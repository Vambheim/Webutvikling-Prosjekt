import express from 'express';
import recipeService from './recipe-service';

/**
 * Express router containing task methods.
 */
const router = express.Router();

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

//Example request body: { country: "China" }
//Example request body: { category: "Asian" }
//Example request body: { ingredient: "Carrot" }
router.get('/recipes/:country/:category/:ingredient', (request, response) => {
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

//Add ingredient:
router.post('/ingredients', (request, response) => {
  const data = request.body;
  if (data && data.name != 0)
    recipeService
      .createIngredient(data.name)
      .then(() => response.send('Status 201'))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing recipe details');
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
