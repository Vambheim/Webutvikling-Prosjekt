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
    .getIngredients(recipe_id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
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

export default router;
