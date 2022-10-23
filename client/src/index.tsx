import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { NavBar, Card, Alert } from './widgets';
import { RecipeList, TaskDetails, TaskEdit, TaskNew } from './recipe-components';

class Menu extends Component {
  render() {
    return (
      //En link for oppskriftene,
      //en for å legge til nye oppskrifter
      //en for handleliste
      <NavBar brand="Food Recipe App">
        <NavBar.Link to="/tasks">Recipes</NavBar.Link>
        <NavBar.Link to="/tasks">Add Recipes</NavBar.Link>
        <NavBar.Link to="/tasks">Shopping Cart</NavBar.Link>
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
      <Route exact path="/tasks" component={RecipeList} />
      <Route exact path="/tasks/:id(\d+)" component={TaskDetails} /> {/* id must be number */}
      <Route exact path="/tasks/:id(\d+)/edit" component={TaskEdit} /> {/* id must be number */}
      <Route exact path="/tasks/new" component={TaskNew} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
