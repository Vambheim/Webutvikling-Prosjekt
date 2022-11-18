import RecipeService, {
  Ingredient,
  RecipeDetailed,
  Step,
  RecipeIngredient,
} from './recipe-service';

export async function getRecipesBulk(testData: any) {
  //Typescript defining a promise which returns three Arrays
  const getApi = async (): Promise<
    [Array<RecipeDetailed>, Array<RecipeIngredient>, Array<Step>]
  > => {
    //fetch data from the thirdparty API or alternatively us the declared testdata (this feature is only used in the testing) 
    const api = testData == null ? await fetch(
      `https://api.spoonacular.com/recipes/random?apiKey=${process.env.REACT_APP_API_KEY}&number=20`
    ) : testData;

    //Formatting the data from the thirdparty API
    const data = testData == null ? await api.json() : testData;
    const recipeJSON = data['recipes'];

    //arrays with which to send data within further down the API
    var recipes: Array<RecipeDetailed> = [];
    var ingriedientsUnique: Array<RecipeIngredient> = [];
    var steps: Array<Step> = [];

    for (let i = 0; i < recipeJSON.length;) {
      //variablles to save ingridiences spesific to a given recipe
      const recipeIngriedents = recipeJSON[i]['extendedIngredients'];
      var recipeSteps = [];
      var ingriedients: Array<RecipeIngredient> = [];

      //recipesteps aren't always includeded in the data, so the following is to handle such a case
      if (
        recipeJSON[i]['analyzedInstructions'].length != 0 &&
        recipeJSON[i]['analyzedInstructions'] != undefined &&
        recipeJSON[i]['analyzedInstructions'] &&
        recipeJSON[i]['analyzedInstructions'] != null
      ) {
        recipeSteps = recipeJSON[i]['analyzedInstructions'][0]['steps'];
      }

      //traverse ingrediences in recipe
      for (let y = 0; y < recipeIngriedents.length;) {
        //Define an object with the needed data for Ingriedent from JSON
        const ingriedent: RecipeIngredient = {
          ingredient_id: recipeIngriedents[y]['id'],
          name: recipeIngriedents[y]['name'],
          recipe_id: recipeJSON[i]['id'],
          amount_per_person: recipeIngriedents[y]['amount'],
          measurement_unit: recipeIngriedents[y]['unit'],
        };

        //Set in ingridients
        if (
          recipeJSON[i]['cuisines'] &&
          recipeJSON[i]['cuisines'][0] != undefined &&
          recipeJSON[i]['dishTypes'] &&
          recipeJSON[i]['dishTypes'][0] != undefined &&
          recipeSteps != null
        ) {
          ingriedients.push(ingriedent);

          //list with unique ids, to avoid dobbel instances of ingridiences 
          if (!ingriedientsUnique.some((e) => e.ingredient_id == ingriedent.ingredient_id))
            ingriedientsUnique.push(ingriedent);
        }

        y++;
      }

      //object with needed data for Recipe from JSON
      const recipe: RecipeDetailed = {
        recipe_id: recipeJSON[i]['id'],
        name: recipeJSON[i]['title'],
        category: recipeJSON[i]['dishTypes'] ? recipeJSON[i]['dishTypes'][0] : null, // The firsh dishtype if it exists
        country: recipeJSON[i]['cuisines'] ? recipeJSON[i]['cuisines'][0] : null, // The first cuisine if it exists
        ingriedients: ingriedients, // adds the list of ingridients 
      };

      if (
        recipe.country != null &&
        recipe.country != undefined &&
        recipe.category != null &&
        recipe.category != undefined &&
        recipeSteps != null
      ) {
        //Push recipe in array
        recipes.push(recipe);

        //Traverse steps for every recipe and put them in an array 
        for (let z = 0; z < recipeSteps.length;) {
          const step: Step = {
            step_id: 1,
            description: recipeSteps[z]['step'],
            order_number: recipeSteps[z]['number'],
            recipe_id: recipe.recipe_id,
          };

          steps.push(step);
          z++;
        }
      }
      i++;
    }

    //return threee different arrays which can be refered to depending on which one is needed
    return [recipes, ingriedientsUnique, steps];
  };

  const result = await getApi();

  //Call REST API for every involved tabel in the database
  RecipeService.PostSpoonacularRecipes(result[0])
  RecipeService.PostSpoonacularIngriedents(result[1]);
  RecipeService.PostSpoonacularRecipeIngriedents(result[0]);
  RecipeService.PostSpoonacularSteps(result[2]);

  return result
}

