import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { Alert, Card } from './widgets';
import {
  RecipeAdd,
  RecipeList,
  ShoppingList,
  TaskDetails,
  TaskEdit,
  TaskNew,
} from './recipe-components';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
// import Card from 'react-bootstrap/Card';

class Menu extends Component {
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/" className="ms-auto">
            Java matapplikasjon
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/#/recipes">Oppskrifter</Nav.Link>
              <Nav.Link href="/#/recipes/add">Legg til oppskrift</Nav.Link>
              <Nav.Link href="/#/recipes/cart">Handleliste</Nav.Link>
              <NavDropdown title="Innstillinger" id="basic-nav-dropdown">
                <NavDropdown.Item href="/#/recipes/cart">Profil</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Mørk modus</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Overrask meg</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
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
