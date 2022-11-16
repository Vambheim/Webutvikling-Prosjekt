import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import { Alert } from './widgets';
import { Carousel, Card, Button, Row, Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { RecipeAdd, RecipeList, RecipeDetails, RecipeEdit } from './recipe-components';
import { ShoppingList } from './shoppingList-components';
import RecipeService, {
  Ingredient,
  RecipeDetailed,
  Step,
  RecipeIngredient,
} from './recipe-service';
import { UserDetails, UserLogIn, RegisterUser } from './user-components';
import { getRecipesBulk } from './thirdparty-api-formatting';

class Menu extends Component {
  render() {
    return (
      /*Renders navbar using components from React-Bootstrap library */
      <Navbar
        collapseOnSelect
        expand="lg"
        variant="dark"
        style={{ backgroundColor: 'rgb(82 130 101)' }}
      >
        <Container>
          {/* Container to wrap elements of navbar within given margin of page end and start */}

          <Navbar.Brand href="#">
            <img
              src="https://tihldestorage.blob.core.windows.net/imagepng/a70fd0bd-f8c0-45eb-b808-293149cf2620resapi-high-resolution-logo-white-on-transparent-background.png"
              width="110"
              height="40"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link href="/#/recipes">Recipes</Nav.Link>
              <Nav.Link href="/#/recipes/add">Add recipe</Nav.Link>
              <Nav.Link href="/#/recipes/shoppinglist">Shopping List</Nav.Link>
              <Nav.Link href="/#/recipes/user">My account</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
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
  }
  render() {
    return (
      <Container>
        <Card
          style={{
            border: 'none',
            textAlign: 'center',
            margin: '2%',
          }}
        >
          {/* Carousel on first page with navlink to recipes and user */}
          <Card.Body>
            <Card style={{ border: 'none', textAlign: 'center', backgroundColor: '' }}>
              <Card.Body>
                <Carousel variant="dark">
                  <Carousel.Item interval={1500}>
                    <img
                      className="d-block w-100"
                      src="https://tihldestorage.blob.core.windows.net/imagepng/5ca4cfc7-6cec-4315-a39b-cf5911fc84e6resapi-high-resolution-color-logo%20%281%29.png"
                      alt="First slide"
                      height={'auto'}
                    />
                  </Carousel.Item>
                  <Carousel.Item interval={500}>
                    <img
                      className="d-block w-100"
                      src="https://s.tihlde.org/kake"
                      alt="Second slide"
                    />
                    <Carousel.Caption style={{ color: 'white', marginBottom: '23%' }}>
                      <h3>In need of inspiration? </h3>

                      <NavLink to={'/recipes'} style={{ color: 'white', textDecoration: 'none' }}>
                        Click here to see our recipes
                      </NavLink>
                    </Carousel.Caption>
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="https://s.tihlde.org/suppe"
                      alt="Third slide"
                    />
                    <Carousel.Caption style={{ color: 'white', marginBottom: '23%' }}>
                      <h3>Logged in yet? </h3>
                      <NavLink
                        to={'/recipes/user'}
                        style={{ color: 'white', textDecoration: 'none' }}
                      >
                        Click here to visit your profile
                      </NavLink>
                    </Carousel.Caption>
                  </Carousel.Item>
                </Carousel>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Container>
    );
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
