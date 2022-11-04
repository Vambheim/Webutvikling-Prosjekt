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

class Menu extends Component {
  //henter data fra spoonacular når komponentet lastes
  mounted() {
    var allowed = false;
    var string = '';
    var til100 = '';
    var til200 = '';
    var til300 = '';
    var til400 = '';
    var til500 = '';
    for (let i = 0; i <= 500; i++) {
      string = string.concat(`${i},`);
      switch (i) {
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
      }
    }

    function getRecipesBulk(ids: String) {
      const getApi = async () => {
        const api = await fetch(
          `https://api.spoonacular.com/recipes/informationBulk?apiKey=${process.env.REACT_APP_API_KEY}&ids=${ids}?`

          //`https://api.spoonacular.com/recipes/random?apiKey=${process.env.REACT_APP_API_KEY}&number=500`
        );
        //${process.env.REACT_APP_API_KEY}
        const data = await api.json();
        console.log(data[1]['title']);
      };

      // allowed == true ? getApi() : return
    }
    getRecipesBulk(til100);
    // getRecipesBulk(til200)
    // getRecipesBulk(til300)
    // getRecipesBulk(til400)
    // getRecipesBulk(til500)
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
