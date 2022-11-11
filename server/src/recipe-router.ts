import express from 'express';
import recipeService from './recipe-service';
import bcrypt from 'bcrypt';
import { Recipe } from './recipe-service';
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

// Poster spørring til tabell Recipe
router.post('/recipes', (request, response) => {
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
router.post('/ingridients', (request, response) => {
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
router.post('/ingridients-recipes', (request, response) => {
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
router.post('/steps', (request, response) => {
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

// router.delete('/tasks/:id', (request, response) => {
//   taskService
//     .delete(Number(request.params.id))
//     .then((_result) => response.send())
//     .catch((error) => response.status(500).send(error));
// });

export default router;
