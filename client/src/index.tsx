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
  TaskEdit,
  UserLogIn,
  UserDetails,
  RegisterUser,
  loggedIn,
} from './recipe-components';

class Menu extends Component {
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
      <Route exact path="/recipes/:id(\d+)/edit" component={TaskEdit} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
