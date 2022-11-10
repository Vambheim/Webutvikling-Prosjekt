import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { NavBar, Card, Alert } from './widgets';
import {
  RecipeAdd,
  RecipeList,
  ShoppingList,
  RecipeDetails,
  RecipeEdit,
  UserLogIn,
  RegisterUser,
  UserDetails,
  loggedIn,
} from './recipe-components';
import RecipeService, { Ingredient, RecipeDetailed } from './recipe-service';

class Menu extends Component {
  //henter data fra spoonacular når komponentet lastes
  mounted() {

    //kan løses "cleanere" med et array med objekter og funksjonell programmering men ok løsning for nå:
    var string = '';
    var til100 = '';
    var til200 = '';
    var til300 = '';
    var til400 = '';
    var til500 = '';
    var til600 = '';
    var til700 = '';
    for (let i = 0; i <= 500; i++) {
      string = string.concat(`${i},`);
      switch (i) {
        //sett inn heller noe sånt som under med funksjon med casen som parameter 
        // function acase(case){
        //   case case:
        //     array[`${case}`] = string.slice(0, -1);
        //     string = '';
        //     break;
        // }
        case 100:
          til100 = string.slice(0, -1);
          string = '';
          break;
        case 200:
          til200 = string.slice(0, -1);
          string = '';
          break;
        case 300:
          til300 = string.slice(0, -1);
          string = '';
          break;
        case 400:
          til400 = string.slice(0, -1);
          string = '';
          break;
        case 500:
          til500 = string.slice(0, -1);
          string = '';
          break;
        case 600:
          til600 = string.slice(0, -1);
          string = '';
          break;
        case 700:
          til700 = string.slice(0, -1);
          string = '';
          break;
      }
    }

    async function getRecipesBulk(ids: String) {
      const getApi = async (): Promise<[Array<RecipeDetailed>, Array<Ingredient>]> => { //Typescript krever et promise som returner en tuppel med to Arrays
        const api = await fetch(
          //'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772'

          //`https://api.spoonacular.com/recipes/informationBulk?apiKey=${process.env.REACT_APP_API_KEY}&ids=${ids}`

          `https://api.spoonacular.com/recipes/random?apiKey=${process.env.REACT_APP_API_KEY}&number=500`
        );
        //${process.env.REACT_APP_API_KEY}
        const data = await api.json();

        //lagerer objekter i array for å sende videre i API-et
        var recipes: Array<RecipeDetailed> = [];
        var ingriedientsUnique: Array<Ingredient> = [];

        for (let i = 0; i < data.length;) {

          //variabler for å lagre ingridienser knyttt en oppskrift
          var recipeIngriedents = data[i]['extendedIngredients'];
          var ingriedients: Array<Ingredient> = [];

          //traverserer ingredienser i oppskriften
          for (let y = 0; y < recipeIngriedents.length;) {

            //Lager et objekt med utvalgt data for Ingriedent fra JSON
            const ingriedent: Ingredient = {
              ingredient_id: recipeIngriedents[y]['id'],
              name: recipeIngriedents[y]['name'],
              recipe_id: data[i]['id'],
              amount_per_person: recipeIngriedents[y]['amount'],
              measurement_unit: recipeIngriedents[y]['unit'],
            };

            if (data[i]['cuisines'] && data[i]['cuisines'][0] != undefined) ingriedients.push(ingriedent);

            //lager en liste over unike id-er for å unngå dobbeltlagring av ingridienser 
            if (!ingriedientsUnique.some(e => e.ingredient_id == recipeIngriedents[y]['id'])) ingriedientsUnique.push(ingriedent)

            y++
          }

          //Lager et objekt med utvalgt data for Recipe fra JSON
          const recipe: RecipeDetailed = {
            recipe_id: data[i]['id'],
            name: data[i]['title'],
            category: data[i]['dishTypes'] ? data[i]['dishTypes'][0] : null, // Henter den første dishtype hvis det eksisterer
            country: data[i]['cuisines'] ? data[i]['cuisines'][0] : null, // Henter den første cuisine hvis det eksisterer
            ingriedients: ingriedients // Legger til listen over ingridiens objekter
          };

          if (recipe.country != null && recipe.country != undefined) recipes.push(recipe);

          i++;
        }

        return [recipes, ingriedientsUnique];
      };

      const result = await getApi()

      RecipeService.PostSpoonacularRecipes(result[0]);
      RecipeService.PostSpoonacularIngriedents(result[1]);
      RecipeService.PostSpoonacularRecipeIngriedents(result[0]);

    }
    setTimeout(() => {
      clearInterval(setInterval(() => getRecipesBulk(""), 1000))
    }, 10000);
    // getRecipesBulk(til100);
    // getRecipesBulk(til200);
    // getRecipesBulk(til300);
    // getRecipesBulk(til400);
    // getRecipesBulk(til500);
    // getRecipesBulk(til600);
    // getRecipesBulk(til700);
  }

  render() {
    return (
      //En link for oppskriftene,
      //en for å legge til nye oppskrifter
      //en for handleliste
      <NavBar brand="/ˈres.A.PI/ -An app">
        <NavBar.Link to="/recipes">Recipes</NavBar.Link>
        <NavBar.Link to="/recipes/add">Add Recipes</NavBar.Link>
        <NavBar.Link to="/recipes/cart">Shopping List</NavBar.Link>
        {loggedIn ? (
          <NavBar.Link to="/recipes/user">My user</NavBar.Link>
        ) : (
          <NavBar.Link to="/recipes/login">Log in</NavBar.Link>
        )}
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return <Card title="Welcome">This is your favourite food recipe app</Card>;
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Alert />
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/recipes" component={RecipeList} />
      <Route exact path="/recipes/add" component={RecipeAdd} />
      <Route exact path="/recipes/cart" component={ShoppingList} />
      <Route exact path="/recipes/login" component={UserLogIn} />
      <Route exact path="/recipes/register" component={RegisterUser} />
      <Route exact path="/recipes/user/:email" component={UserDetails} />
      <Route exact path="/recipes/:recipe_id(\d+)" component={RecipeDetails} />
      <Route exact path="/recipes/:id(\d+)/edit" component={RecipeEdit} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
