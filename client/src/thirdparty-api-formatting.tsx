import RecipeService, {
  Ingredient,
  RecipeDetailed,
  Step,
  RecipeIngredient,
} from './recipe-service';

export async function getRecipesBulk(testData: any) {
  //Typescript krever et promise som returner tre Arrays
  const getApi = async (): Promise<
    [Array<RecipeDetailed>, Array<RecipeIngredient>, Array<Step>]
  > => {
    //fetch data fra API-et eller evt bruke erklært testdata 
    const api = testData == null ? await fetch(
      `https://api.spoonacular.com/recipes/random?apiKey=${process.env.REACT_APP_API_KEY}&number=20`
    ) : testData;

    //Formater data fra API-et
    const data = testData == null ? await api.json() : testData;
    const recipeJSON = data['recipes'];

    //lagerer objekter i array for å sende videre i API-et
    var recipes: Array<RecipeDetailed> = [];
    var ingriedientsUnique: Array<RecipeIngredient> = [];
    var steps: Array<Step> = [];

    for (let i = 0; i < recipeJSON.length;) {
      //variabler for å lagre ingridienser knyttt en oppskrift
      const recipeIngriedents = recipeJSON[i]['extendedIngredients'];
      var recipeSteps = [];
      var ingriedients: Array<RecipeIngredient> = [];

      //recipesteps er ikke alltid inkludert så må håndtere tilfellet det ikke er
      if (
        recipeJSON[i]['analyzedInstructions'].length != 0 &&
        recipeJSON[i]['analyzedInstructions'] != undefined &&
        recipeJSON[i]['analyzedInstructions'] &&
        recipeJSON[i]['analyzedInstructions'] != null
      ) {
        recipeSteps = recipeJSON[i]['analyzedInstructions'][0]['steps'];
      }

      //traverserer ingredienser i oppskriften
      for (let y = 0; y < recipeIngriedents.length;) {
        //Lager et objekt med utvalgt data for Ingriedent fra JSON
        const ingriedent: RecipeIngredient = {
          ingredient_id: recipeIngriedents[y]['id'],
          name: recipeIngriedents[y]['name'],
          recipe_id: recipeJSON[i]['id'],
          amount_per_person: recipeIngriedents[y]['amount'],
          measurement_unit: recipeIngriedents[y]['unit'],
        };

        //setter inn ingridients
        if (
          recipeJSON[i]['cuisines'] &&
          recipeJSON[i]['cuisines'][0] != undefined &&
          recipeJSON[i]['dishTypes'] &&
          recipeJSON[i]['dishTypes'][0] != undefined &&
          recipeSteps != null
        ) {
          ingriedients.push(ingriedent);

          //lager en liste over unike id-er for å unngå dobbeltlagring av ingridienser
          if (!ingriedientsUnique.some((e) => e.ingredient_id == ingriedent.ingredient_id))
            ingriedientsUnique.push(ingriedent);
        }

        y++;
      }

      //Lager et objekt med utvalgt data for Recipe fra JSON
      const recipe: RecipeDetailed = {
        recipe_id: recipeJSON[i]['id'],
        name: recipeJSON[i]['title'],
        category: recipeJSON[i]['dishTypes'] ? recipeJSON[i]['dishTypes'][0] : null, // Henter den første dishtype hvis det eksisterer
        country: recipeJSON[i]['cuisines'] ? recipeJSON[i]['cuisines'][0] : null, // Henter den første cuisine hvis det eksisterer
        ingriedients: ingriedients, // Legger til listen over ingridiens objekter
      };

      if (
        recipe.country != null &&
        recipe.country != undefined &&
        recipe.category != null &&
        recipe.category != undefined &&
        recipeSteps != null
      ) {
        //Pusher recipe i array
        recipes.push(recipe);

        //Traverserer steps for hver oppskrift og putter det i array
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

    //returnerer tre ulike array som kan refereres til avhengig av hvilke som trengs
    return [recipes, ingriedientsUnique, steps];
  };

  const result = await getApi();

  //Kaller REST API for hver enkelt tabell i databasen
  RecipeService.PostSpoonacularRecipes(result[0])
  RecipeService.PostSpoonacularIngriedents(result[1]);
  RecipeService.PostSpoonacularRecipeIngriedents(result[0]);
  RecipeService.PostSpoonacularSteps(result[2]);

  return result
}

