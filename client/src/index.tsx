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

class Menu extends Component {
  //henter data fra spoonacular når komponentet lastes
  //
  //
  //Kan vi legge denne i home klassen?
  mounted() {
    //funksjonen kan vel defineres en annen plass som er mer hensiktsmessig og ryddig
    async function getRecipesBulk() {
      const getApi = async (): Promise<
        [Array<RecipeDetailed>, Array<RecipeIngredient>, Array<Step>]
      > => {
        //Typescript krever et promise som returner en tuppel med to Arrays
        const api = await fetch(
          //'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772'

          //`https://api.spoonacular.com/recipes/informationBulk?apiKey=${process.env.REACT_APP_API_KEY}&ids=${ids}`

          `https://api.spoonacular.com/recipes/random?apiKey=${process.env.REACT_APP_API_KEY}&number=20`
        );
        //${process.env.REACT_APP_API_KEY}
        const data = await api.json();
        const recipeJSON = data['recipes'];

        //lagerer objekter i array for å sende videre i API-et
        var recipes: Array<RecipeDetailed> = [];
        var ingriedientsUnique: Array<RecipeIngredient> = [];
        var steps: Array<Step> = [];

        for (let i = 0; i < recipeJSON.length; ) {
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
          for (let y = 0; y < recipeIngriedents.length; ) {
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
            for (let z = 0; z < recipeSteps.length; ) {
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
      RecipeService.PostSpoonacularRecipes(result[0]);
      RecipeService.PostSpoonacularIngriedents(result[1]);
      RecipeService.PostSpoonacularRecipeIngriedents(result[0]);
      RecipeService.PostSpoonacularSteps(result[2]);
    }

    //Endre denne for å skru av og på kall til API-et
    const retrieveFromApi = false;

    if (retrieveFromApi) {
      const intervalAPI = setInterval(() => getRecipesBulk(), 1500);
      setTimeout(() => {
        clearInterval(intervalAPI);
      }, 7500);
    }
  }

  render() {
    return (
      /*Renders navbar using components from React-Bootstrap library */
      <Navbar
        collapseOnSelect
        expand="lg"
        variant="dark"
        style={{ backgroundColor: 'rgb(82 130 101)' }}
      >
        {/* Container to wrap elements of navbar within given margin of page end and start */}
        <Container>
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
