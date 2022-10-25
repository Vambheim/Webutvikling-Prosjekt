import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { NavBar, Card, Alert } from './widgets';
import {
  RecipeAdd,
  RecipeList,
  ShoppingList,
  TaskDetails,
  TaskEdit,
  TaskNew,
} from './recipe-components';

class Menu extends Component {
  render() {
    return (
      //En link for oppskriftene,
      //en for å legge til nye oppskrifter
      //en for handleliste
      <NavBar brand="Food Recipe App">
        <NavBar.Link to="/recipes">Recipes</NavBar.Link>
        <NavBar.Link to="/recipes/add">Add Recipes</NavBar.Link>
        <NavBar.Link to="/recipes/cart">Shopping List</NavBar.Link>
        <NavBar.Link to="/recipes/cart">My User</NavBar.Link>
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
      <Route exact path="/tasks/:id(\d+)" component={TaskDetails} /> {/* id must be number */}
      <Route exact path="/tasks/:id(\d+)/edit" component={TaskEdit} /> {/* id must be number */}
      <Route exact path="/tasks/new" component={TaskNew} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
