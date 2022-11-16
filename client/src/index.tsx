import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { NavBar, Card, Alert } from './widgets';
import { RecipeAdd, RecipeList, RecipeDetails, RecipeEdit } from './recipe-components';
import { ShoppingList } from './shoppingList-components';
import RecipeService, {
  Ingredient,
  RecipeDetailed,
  Step,
  RecipeIngredient,
} from './recipe-service';
import { UserDetails, UserLogIn, RegisterUser } from './user-components';
import { getRecipesBulk } from './thirdparty-api-formatting'

class Menu extends Component {
  render() {
    return (
      <NavBar brand="/ˈres.A.PI/ -An app">
        <NavBar.Link to="/recipes">Recipes</NavBar.Link>
        <NavBar.Link to="/recipes/add">Add Recipes</NavBar.Link>
        <NavBar.Link to="/recipes/shoppinglist">Shopping List</NavBar.Link>
        <NavBar.Link to="/recipes/user">{'User 👤'}</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  mounted() {
    //Endre denne for å skru av og på kall til API-et
    const retrieveFromApi = false;

    //henter 5 * 20 oppskrifter fra API-et spoonacular når komponentet lastes
    if (retrieveFromApi) {
      const intervalAPI = setInterval(() => getRecipesBulk(null), 1500);
      setTimeout(() => {
        clearInterval(intervalAPI);
      }, 7500);
    }
    getRecipesBulk(null)

  }
  render() {
    return <Card title="Welcome">This is your favourite food recipe app</Card>;
  }
  // legg til spoontacular her i stedet for i menyen
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Alert />
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/recipes" component={RecipeList} />
      <Route exact path="/recipes/add" component={RecipeAdd} />
      <Route exact path="/recipes/shoppinglist" component={ShoppingList} />
      <Route exact path="/recipes/login" component={UserLogIn} />
      <Route exact path="/recipes/register" component={RegisterUser} />
      <Route exact path="/recipes/user" component={UserDetails} />
      {/* // her må vi endre noe ^ */}
      <Route exact path="/recipes/:recipe_id(\d+)" component={RecipeDetails} />
      <Route exact path="/recipes/:id(\d+)/edit" component={RecipeEdit} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);