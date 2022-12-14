import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Column } from './widgets';
import { NavLink } from 'react-router-dom';
import recipeService, {
  Recipe,
  Step,
  RecipeIngredient,
  Ingredient,
  addIngredient,
  addStep,
} from './recipe-service';
import { Button, Form, Card, Row, Col, Container } from 'react-bootstrap';
import { createHashHistory } from 'history';
import shoppingListService from './shoppingList-service';
import { loggedIn, currentUser } from './user-components';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a recipe

/**
 * Renders recipe list.
 */
export class RecipeList extends Component {
  country: string = '';
  category: string = '';

  ingredient1: Ingredient = { ingredient_id: 0, name: '' };
  ingredient2: Ingredient = { ingredient_id: 0, name: '' };
  ingredient3: Ingredient = { ingredient_id: 0, name: '' };

  activeIngredientFilters: number = 0;
  ingredients: Ingredient[] = [];

  recipes: Recipe[] = []; // original, do not change
  filtered_recipes: Recipe[] = [];

  search_input: string = '';

  render() {
    return (
      <>
        {/* Search bar for easy access to gicen recipe */}
        <Card style={{ border: 'none', padding: '15px' }}>
          <Card.Title style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Search for a recipe
          </Card.Title>

          <Row
            style={{
              textAlign: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <Col>
              <Form.Control
                onChange={(event) => this.search(event.currentTarget.value)}
                value={this.search_input}
                type="Search"
                placeholder="Search"
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  textAlign: 'center',
                  width: '24rem',
                }}
              ></Form.Control>
            </Col>
          </Row>
        </Card>
        <Column>
          {/* Card for displaying filters on left side of screen */}
          <Container
            style={{
              borderLeft: 'none',
              borderTop: 'none',
              borderBottom: 'none',
              margin: '5%',
            }}
          >
            <Card
              style={{
                width: '12rem',
                border: 'none',
                textAlign: 'center',
              }}
            >
              <Card.Title>Filter by country and category:</Card.Title>
              <Row>
                <Col>
                  <Form.Select
                    value={this.country}
                    onChange={(event) => (this.country = event.currentTarget.value)}
                    style={{ marginBottom: '10px' }}
                  >
                    <option key={'blankChoice'} hidden>
                      {'Choose country: '}
                    </option>

                    {this.recipes
                      .map((recipe) => recipe.country)
                      .filter((country, index, array) => array.indexOf(country) === index)
                      .map((country, i) => (
                        <option key={i} value={country}>
                          {country}
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Select
                    value={this.category}
                    onChange={(event) => (this.category = event.currentTarget.value)}
                    style={{ marginBottom: '10 px' }}
                  >
                    <option key={'blankChoice'} hidden>
                      {'Choose category: '}
                    </option>
                    {this.recipes
                      .map((recipe) => recipe.category)
                      .filter((category, index, array) => array.indexOf(category) === index)
                      .map((category, i) => (
                        <option key={i} value={category}>
                          {category}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Row>
              <Button
                variant="outline-success"
                onClick={() => this.addCountryAndOrCategoryFilter()}
                style={{ width: '60%', marginLeft: 'auto', marginRight: 'auto', marginBlock: '5%' }}
              >
                Add filters
              </Button>
            </Card>
            <Card
              style={{
                width: '12rem',
                border: 'none',
                textAlign: 'center',
              }}
            >
              <Card.Title> Filter by ingredient: </Card.Title>
              <Row>
                <Col>
                  <Form.Select
                    value={this.ingredient1['name']}
                    onChange={(event) => (this.ingredient1['name'] = event.currentTarget.value)}
                    style={{ marginBottom: '10px' }}
                  >
                    <option key={'blankChoice'} hidden>
                      {'Choose ingredient: '}
                    </option>
                    {this.ingredients
                      .map((ing) => ing.name)
                      .filter((ing, index, array) => array.indexOf(ing) === index)
                      .map((ing, i) => (
                        <option key={i} value={ing}>
                          {this.firstLetterUpperCase(ing)}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Select
                    value={this.ingredient2['name']}
                    style={{ marginBottom: '10px' }}
                    onChange={(event) => (this.ingredient2['name'] = event.currentTarget.value)}
                  >
                    <option key={'blankChoice'} hidden>
                      {'Choose ingredient: '}
                    </option>
                    {this.ingredients
                      .map((ing) => ing.name)
                      .filter((ing, index, array) => array.indexOf(ing) === index)
                      .map((ing, i) => (
                        <option key={i} value={ing}>
                          {this.firstLetterUpperCase(ing)}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Select
                    value={this.ingredient3['name']}
                    onChange={(event) => (this.ingredient3['name'] = event.currentTarget.value)}
                    style={{ marginBottom: '10px' }}
                  >
                    <option key={'blankChoice'} hidden>
                      {'Choose ingredient: '}
                    </option>
                    {this.ingredients
                      .map((ing) => ing.name)
                      .filter((ing, index, array) => array.indexOf(ing) === index)
                      .map((ing, i) => (
                        <option key={i} value={ing}>
                          {this.firstLetterUpperCase(ing)}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="outline-success"
                    onClick={() => this.addIngredientFilter()}
                    style={{
                      width: '60%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginBlock: '5%',
                    }}
                  >
                    Add filters
                  </Button>
                </Col>
              </Row>
              <Row>
                <Button
                  variant="outline-danger"
                  onClick={() => this.removeFilter()}
                  style={{
                    width: '70%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  Remove filters
                </Button>
              </Row>
            </Card>
          </Container>
        </Column>

        {/* Map recipes with 4 recipes in each row til windowsize is too small*/}
        <Container>
          <Col lg>
            <Row xs={1} md={4} className="g-4">
              {this.filtered_recipes.map((recipe) => (
                <NavLink
                  to={'/recipes/' + recipe.recipe_id}
                  style={{
                    color: '#9FC1C0',
                  }}
                >
                  <Column>
                    <Card
                      style={{
                        width: '100%',
                        margin: '1%',
                        textAlign: 'center',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderTop: 'none',
                        borderRadius: 'none',
                        height: '100%',
                      }}
                    >
                      <Card.Body>
                        <Card.Img variant="top" src="https://s.tihlde.org/recipechef12312" />
                        <Card.Title style={{ color: 'rgb(82, 130, 101)' }}>
                          {recipe.name}
                        </Card.Title>
                        <Card.Text>
                          {recipe.country} {recipe.category}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Column>
                </NavLink>
              ))}
            </Row>
            ;
          </Col>
        </Container>
      </>
    );
  }

  mounted() {
    recipeService
      .getAll()
      .then((recipes) => (this.recipes = recipes) && (this.filtered_recipes = recipes))
      .catch((error) => Alert.danger('Error getting recipe: ' + error.message));

    recipeService
      .getAllIngredients()
      .then((ingredients) => (this.ingredients = ingredients))
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
  }

  firstLetterUpperCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  search(input: string) {
    this.search_input = input;
    let searchRecipe: Recipe[] = [];

    this.recipes.map((recipe) => {
      if (recipe.name.toLowerCase().includes(this.search_input.toLowerCase())) {
        searchRecipe.push(recipe);
      }
    });
    this.filtered_recipes = searchRecipe;
  }

  addCountryAndOrCategoryFilter() {
    if (this.country.length != 0 && this.category.length != 0) {
      recipeService
        .getFilterByCountryAndCategory(this.country, this.category)
        .then((filteredRecipes) => {
          this.filtered_recipes = filteredRecipes;
          this.filtered_recipes = filteredRecipes;
          if (filteredRecipes.length == 0) Alert.info('No recipes matches your selected filters');
        })
        .catch((error) => Alert.danger('Error filtering recipes. ' + error.message));
    } else if (this.category.length != 0 && this.country.length == 0) {
      recipeService
        .getFilterByCategory(this.category)
        .then((filteredRecipes) => (this.filtered_recipes = filteredRecipes))
        .catch((error) => Alert.danger('Error filtering recipes. ' + error.message));
    } else if (this.country.length != 0 && this.category.length == 0) {
      recipeService
        .getFilterByCountry(this.country)
        .then((filteredRecipes) => (this.filtered_recipes = filteredRecipes))
        .catch((error) => Alert.danger('Error filtering recipes. ' + error.message));
    } else {
      Alert.danger('No selected filters');
    }
  }

  activeFilterCount() {
    let count: number = 0;
    if (
      (!this.ingredient1.name && this.ingredient2.name && !this.ingredient3.name) ||
      (this.ingredient1.name && !this.ingredient2.name && !this.ingredient3.name) ||
      (!this.ingredient1.name && !this.ingredient2.name && this.ingredient3.name)
    ) {
      count = 1;
    } else if (this.ingredient1.name && this.ingredient2.name && this.ingredient3.name) {
      count = 3;
    } else if (!this.ingredient1.name && !this.ingredient2.name && !this.ingredient3.name) {
      count = 0;
    } else {
      count = 2;
    }
    this.activeIngredientFilters = count;
  }

  addIngredientFilter() {
    this.activeFilterCount();
    if (this.activeIngredientFilters == 3) {
      recipeService
        .getFilterBy3Ingredients(
          this.ingredient1.name,
          this.ingredient2.name,
          this.ingredient3.name
        )
        .then((recipe) => {
          this.filtered_recipes = recipe;
          if (recipe.length == 0) Alert.info('No recipes matches your selected filters');
        })
        .catch((error) => Alert.danger('Error filtering recipes. ' + error.message));
    } else if (this.activeIngredientFilters == 2) {
      recipeService
        .getFilterBy2Ingredients(
          this.ingredient1.name ? this.ingredient1.name : this.ingredient2.name,
          this.ingredient3.name ? this.ingredient3.name : this.ingredient2.name
        )
        .then((recipe) => {
          this.filtered_recipes = recipe;
          if (recipe.length == 0) Alert.info('No recipes matches your selected filters');
        })
        .catch((error) => Alert.danger('Error filtering recipes. ' + error.message));
    } else if (this.activeIngredientFilters == 1) {
      recipeService
        .getFilterByOneIngredient(
          this.ingredient1.name + this.ingredient2.name + this.ingredient3.name
        )
        .then((recipe) => {
          this.filtered_recipes = recipe;
          if (recipe.length == 0) Alert.info('No recipes matches your selected filters');
        })
        .catch((error) => Alert.danger('Error filtering recipes. ' + error.message));
    } else {
      Alert.info('No selected filters');
    }
  }

  removeFilter() {
    this.country = '';
    this.category = '';
    this.ingredient1.name = '';
    this.ingredient2.name = '';
    this.ingredient3.name = '';
    this.filtered_recipes = this.recipes;
    this.activeIngredientFilters = 0;
  }
}

export class RecipeDetails extends Component<{ match: { params: { recipe_id: number } } }> {
  recipe: Recipe = { recipe_id: 0, name: '', category: '', country: '' };
  steps: Step[] = [];
  ingredients: RecipeIngredient[] = [];
  portions: number = 1;
  recomended_recipes: Recipe[] = [];

  render() {
    return (
      <>
        <Container>
          <Card
            style={{
              borderLeft: 'none',
              borderRight: 'none',
              borderTop: 'none',
              paddingBottom: '3%',
              borderRadius: '0px',
              textAlign: 'center',
            }}
            title={'Recipe for ' + this.recipe.name}
          >
            <Card.Title style={{ paddingTop: '5%' }}>
              {' '}
              {'Recipe for ' + this.recipe.name}
            </Card.Title>
            <Row className="justify-content-md-center">
              <Col xs={5}>
                <h6>Steps: </h6>
                <ol>
                  {this.steps.map((step) => (
                    <Row key={step.order_number}>
                      <Column>
                        <li> {step.description}</li>
                      </Column>
                    </Row>
                  ))}
                </ol>
                <Row>
                  <Button
                    style={{ width: '5rem', margin: 'auto', marginTop: '10%', height: '4rem' }}
                    variant="outline-danger"
                    onClick={() => this.likeRecipe()}
                  >
                    Like &#10084;
                  </Button>
                  <Button
                    style={{ width: '5rem', margin: 'auto', marginTop: '10%', height: '4rem' }}
                    variant="success"
                    onClick={() => this.editRecipe()}
                  >
                    Edit
                  </Button>
                </Row>
              </Col>
              <Col>
                <h6>Ingredients: </h6>
                <Row className="justify-content-md-center">
                  Portion:
                  <Col md="auto">
                    <Form.Control
                      type="number"
                      value={this.portions}
                      onChange={(event) => (this.portions = Number(event.currentTarget.value))}
                      min={1}
                      max={50}
                    ></Form.Control>
                  </Col>
                </Row>
                {this.ingredients.map((ing) => (
                  <Row key={ing.ingredient_id}>
                    <Col>
                      {(ing.amount_per_person * this.portions).toFixed(2) +
                        ' ' +
                        ing.measurement_unit +
                        ' ' +
                        ing.name}

                      {/* Adds to shopping list, if logged in */}
                      <Button
                        variant="light"
                        onClick={() =>
                          this.addItemToShoppingList(
                            ing.ingredient_id,
                            ing.amount_per_person,
                            ing.measurement_unit
                          )
                        }
                      >
                        &#128722;
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Button
                    style={{ width: '15rem', margin: 'auto', marginTop: '1%' }}
                    variant="success"
                    onClick={() => this.addAllToShoppingList()}
                  >
                    Add to shopping list
                  </Button>
                </Row>
              </Col>
            </Row>
          </Card>
          <Card
            style={{
              padding: '20px',
              textAlign: 'center',
              border: 'none',
            }}
          >
            <Card.Title>You may also like:</Card.Title>
            <Col lg>
              <Row xs={1} md={4} className="g-4">
                {this.recomended_recipes.map((recomended_recipe) => (
                  <NavLink
                    to={'/recipes/' + recomended_recipe.recipe_id}
                    style={{
                      color: '#9FC1C0',
                    }}
                  >
                    <Column>
                      <Card
                        style={{
                          width: '100%',
                          margin: '1%',
                          textAlign: 'center',
                          borderLeft: 'none',
                          borderRight: 'none',
                          borderTop: 'none',
                          borderRadius: 'none',
                          height: '100%',
                        }}
                      >
                        <Card.Body>
                          <Card.Img variant="top" src="https://s.tihlde.org/recipechef12312" />
                          <Card.Title style={{ color: 'rgb(82, 130, 101)' }}>
                            {recomended_recipe.name}
                          </Card.Title>
                          <Card.Text>
                            {recomended_recipe.country} {recomended_recipe.category}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Column>
                  </NavLink>
                ))}
              </Row>
            </Col>
          </Card>
        </Container>
      </>
    );
  }

  mounted() {
    recipeService

      .get(this.props.match.params.recipe_id)
      .then((recipe) => (this.recipe = recipe))
      .then(() => {
        recipeService
          .getRecipeIngredients(this.recipe.recipe_id)
          .then((ingredients) => (this.ingredients = ingredients));
      })
      .then(() => {
        recipeService.getSteps(this.recipe.recipe_id).then((steps) => (this.steps = steps));
      })
      .then(() =>
        recipeService
          .getRecommendedRecipes(
            this.props.match.params.recipe_id,
            this.recipe.category,
            this.recipe.country
          )
          .then((recipes) => (this.recomended_recipes = recipes))
      )
      .catch((error) => Alert.danger('Error getting recipe details: ' + error.message));
  }

  likeRecipe() {
    if (!loggedIn) {
      Alert.info(`You have to log in to like this recipe`);
      history.push('/recipes/login');
    } else {
      recipeService
        .likeRecipe(currentUser.user_id, this.recipe.recipe_id)
        .then((response) => Alert.success(response))
        .catch((error) => Alert.danger(error.response.data));
    }
  }

  addItemToShoppingList(
    ingredient_id: number,
    amount_per_person: number,
    measurement_unit: string
  ) {
    if (!loggedIn) {
      Alert.info('Log in to add ingredients to shopping list');
    } else {
      shoppingListService
        .addToShoppingList(
          this.recipe.recipe_id,
          ingredient_id,
          currentUser.user_id,
          amount_per_person * this.portions,
          measurement_unit
        )
        .then((response) => Alert.success(response))
        .catch((error) => Alert.danger(error.message));
    }
  }

  addAllToShoppingList() {
    if (!loggedIn) {
      Alert.info('Log in to add ingredients to shopping list');
    } else {
      if (confirm('Do you want to add all ingredients to your shopping list')) {
        this.ingredients.map((ingredient) => {
          shoppingListService
            .addToShoppingList(
              this.recipe.recipe_id,
              ingredient.ingredient_id,
              currentUser.user_id,
              ingredient.amount_per_person * this.portions,
              ingredient.measurement_unit
            )
            .then()
            .catch((error) => Alert.danger(error.message));
        });
      } else {
        console.log('Canceled');
      }
    }
  }

  editRecipe() {
    history.push('/recipes/' + this.props.match.params.recipe_id + '/edit');
  }
}

export class RecipeAdd extends Component {
  recipe: Recipe = { recipe_id: 0, name: '', category: '', country: '' };
  portions: number = 1;
  showIng: string = 'hidden';
  showSteps: string = 'hidden';

  ingredients: addIngredient[] = [];
  ingredient: addIngredient = { name: '', amount: 1, measurement_unit: '' };

  stepCounter: number = 1;
  steps: addStep[] = [];
  step: addStep = { description: '', order_number: this.stepCounter };

  render() {
    return (
      <>
        <Container>
          <Row>
            <Col>
              <Card
                style={{
                  border: '0',
                  textAlign: 'center',
                  marginTop: '8%',
                }}
              >
                <Card.Title>Add your new recipe here:</Card.Title>
                <Row>
                  <Form.Control
                    value={this.recipe.name}
                    type="text"
                    placeholder="Name"
                    onChange={(event) => (this.recipe.name = event.currentTarget.value)}
                    style={{
                      textAlign: 'center',
                      width: '60%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginBottom: '10px',
                    }}
                  ></Form.Control>
                </Row>
                <Row>
                  <Form.Control
                    value={this.recipe.category}
                    type="text"
                    placeholder="Category"
                    onChange={(event) => (this.recipe.category = event.currentTarget.value)}
                    style={{
                      textAlign: 'center',
                      width: '60%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginBottom: '10px',
                    }}
                  ></Form.Control>
                </Row>
                <Row>
                  <Form.Control
                    value={this.recipe.country}
                    type="text"
                    placeholder="Country"
                    onChange={(event) => (this.recipe.country = event.currentTarget.value)}
                    style={{
                      textAlign: 'center',
                      width: '60%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginBottom: '10px',
                    }}
                  ></Form.Control>
                </Row>
                <Card.Text> Choose the number of portions for this recipe:</Card.Text>
                <Row>
                  <Form.Control
                    value={this.portions}
                    type="number"
                    min={1}
                    max={50}
                    onChange={(event) => (this.portions = Number(event.currentTarget.value))}
                    style={{
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      width: '5rem',
                      textAlign: 'center',
                      marginBottom: '10px',
                    }}
                  ></Form.Control>
                </Row>
                <Row>
                  <Button
                    variant="outline-success"
                    onClick={() => this.openIngredient()}
                    style={{ width: '15rem', marginLeft: 'auto', marginRight: 'auto' }}
                  >
                    Continue to add ingredients
                  </Button>
                </Row>
              </Card>
              <Card
                style={{
                  border: '0',
                  textAlign: 'center',
                  marginTop: '8%',
                  // @ts-ignore
                  visibility: this.showIng,
                }}
              >
                <Card.Title>Add Ingredients:</Card.Title>
                <Card.Text>Choose amount for this ingredient:</Card.Text>
                <Row>
                  <Form.Control
                    value={this.ingredient.amount}
                    type="number"
                    min={0}
                    onChange={(event) =>
                      (this.ingredient.amount = Number(event.currentTarget.value))
                    }
                    style={{
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      width: '5rem',
                      textAlign: 'center',
                      marginBottom: '10px',
                    }}
                  ></Form.Control>
                </Row>
                <Row>
                  <Form.Control
                    value={this.ingredient.measurement_unit}
                    type="text"
                    placeholder="Measurement unit"
                    style={{
                      textAlign: 'center',
                      width: '60%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginBottom: '10px',
                    }}
                    onChange={(event) =>
                      (this.ingredient.measurement_unit = event.currentTarget.value)
                    }
                  ></Form.Control>
                </Row>
                <Row>
                  <Form.Control
                    value={this.ingredient.name}
                    type="text"
                    placeholder="Ingredient"
                    onChange={(event) => (this.ingredient.name = event.currentTarget.value)}
                    style={{
                      textAlign: 'center',
                      width: '60%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginBottom: '10px',
                    }}
                  ></Form.Control>
                </Row>
                <Row>
                  <Button
                    style={{ width: '30%', marginLeft: '20%', marginBottom: '10px' }}
                    variant="light"
                    onClick={() => this.addIngredient()}
                  >
                    +
                  </Button>

                  <Button
                    style={{ width: '30%', marginBottom: '10px' }}
                    variant="light"
                    onClick={() => this.undoIngredient()}
                  >
                    &#x1F519;
                  </Button>
                </Row>
                <Row>
                  {this.ingredients.map((ing, i) => (
                    <Row key={i}>
                      <li>{ing.amount + ' ' + ing.measurement_unit + ' ' + ing.name}</li>
                    </Row>
                  ))}
                </Row>
                <Row>
                  <Button
                    variant="outline-success"
                    onClick={() => this.openStep()}
                    style={{
                      width: '15rem',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  >
                    Continue to add steps
                  </Button>
                </Row>
              </Card>

              <Card
                style={{
                  border: '0',
                  textAlign: 'center',
                  marginTop: '8%',
                  paddingBottom: '100px',
                  //@ts-ignore
                  visibility: this.showSteps,
                }}
              >
                <Card.Title>Add steps</Card.Title>
                <Row>
                  <Form.Control
                    value={this.step.description}
                    type="text"
                    placeholder="Step"
                    onChange={(event) => (this.step.description = event.currentTarget.value)}
                    style={{
                      textAlign: 'center',
                      width: '60%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginBottom: '10px',
                    }}
                  ></Form.Control>
                </Row>
                <Row>
                  <Button
                    style={{ width: '30%', marginLeft: '20%', marginBottom: '10px' }}
                    variant="light"
                    onClick={() => this.addStep()}
                  >
                    +
                  </Button>
                  <Button
                    style={{ width: '30%', marginBottom: '10px' }}
                    variant="light"
                    onClick={() => this.undoStep()}
                  >
                    &#x1F519;
                  </Button>
                </Row>
                <Row>
                  {this.steps.map((step) => (
                    <Row key={step.order_number}>
                      <Card.Text>{step.order_number + ': ' + step.description}</Card.Text>
                    </Row>
                  ))}
                </Row>
              </Card>
            </Col>

            <Col sm>
              <Card
                style={{
                  width: '70%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: '8%',
                  marginBottom: '10px',
                }}
              >
                <Card.Body style={{ textAlign: 'center' }}>
                  <Card.Title>Preview of your recipe</Card.Title>
                  <Card.Title style={{ color: 'rgb(82, 130, 101)' }}>
                    {' ' + this.recipe.name}
                  </Card.Title>
                  <Card.Subtitle style={{ color: 'rgb(82, 130, 101)', margin: '2%' }}>
                    {' ' + this.recipe.category}
                  </Card.Subtitle>
                  <Card.Subtitle style={{ color: 'rgb(82, 130, 101)', margin: '2%' }}>
                    {' ' + this.recipe.country}
                  </Card.Subtitle>
                  <Card.Subtitle
                    style={{
                      color: 'rgb(82, 130, 101)',
                    }}
                  >
                    {'Ingredients:'}
                    {this.ingredients.map((ing, i) => (
                      <Row key={i} style={{ color: 'black' }}>
                        <li>{ing.amount + ' ' + ing.measurement_unit + ' ' + ing.name}</li>
                      </Row>
                    ))}
                  </Card.Subtitle>
                  <Card.Subtitle
                    style={{
                      color: 'rgb(82, 130, 101)',
                      marginTop: '2%',
                    }}
                  >
                    {'Steps: '}
                    {this.steps.map((step) => (
                      <Row key={step.order_number} style={{ color: 'black' }}>
                        <Col>{step.order_number + ': ' + step.description}</Col>
                      </Row>
                    ))}
                  </Card.Subtitle>
                  <Row>
                    <Button
                      style={{
                        width: '15rem',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: '20px',
                      }}
                      variant="outline-success"
                      onClick={() => this.saveRecipe()}
                    >
                      Save recipe
                    </Button>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  openIngredient() {
    if (
      this.recipe.name == '' ||
      this.recipe.country == '' ||
      this.recipe.category == '' ||
      this.portions <= 0
    ) {
      Alert.danger('All fields must be filled in order to continue');
    } else {
      this.showIng = 'visible';
    }
  }

  addIngredient() {
    if (this.ingredient.amount <= 0 || this.ingredient.name == '') {
      Alert.danger('All required fields must be filled in order to add ingredient');
    } else {
      this.ingredients.push(this.ingredient);
      this.ingredient = { name: '', amount: 1, measurement_unit: '' };
    }
  }

  undoIngredient() {
    this.ingredients.pop();
  }

  openStep() {
    if (this.ingredients.length != 0) {
      this.showSteps = 'visible';
    } else {
      Alert.danger('Please add some ingredients to continue');
    }
  }

  addStep() {
    if (this.step.description == '') {
      Alert.danger('All fields must be filled in order to add step');
    } else {
      this.steps.push(this.step);
      this.stepCounter += 1;
      this.step = { description: '', order_number: this.stepCounter };
    }
  }

  undoStep() {
    this.steps.pop();
    this.stepCounter -= 1;
    this.step.order_number = this.stepCounter;
  }

  saveRecipe() {
    if (this.steps.length != 0) {
      recipeService
        .createRecipe(this.recipe.name, this.recipe.category, this.recipe.country)
        .then((recipe_id) => {
          this.ingredients.map((ing) =>
            recipeService
              .createRecipeIngredients(
                ing.name,
                recipe_id,
                Number(ing.amount / this.portions),
                ing.measurement_unit
              )
              .then((response) => console.log(response))
              .catch((error) => console.log('Error creating recipe_ingredient ' + error.message))
          );
          this.steps.map((step) => {
            recipeService
              .createStep(step.order_number, step.description, recipe_id)
              .then((response) => console.log(response))
              .catch((error) => Alert.danger(error.message));
          });
          Alert.success('Recipe for ' + this.recipe.name + ' was created');
          history.push('/recipes/' + recipe_id);
        })
        .catch((error) => Alert.danger(error.message));
    } else {
      Alert.danger('Please add some steps to save this recipe ');
    }
  }
}

export class RecipeEdit extends Component<{ match: { params: { id: number } } }> {
  recipeIngredients: RecipeIngredient[] = [];

  recipe: Recipe = { recipe_id: 0, name: '', category: '', country: '' };

  recipes: Recipe[] = [];
  steps: Step[] = [];
  ingredients: Ingredient[] = [];
  ingredient: Ingredient = { ingredient_id: 0, name: '' };

  render() {
    return (
      <>
        <Container>
          <Card style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}>
            <Card.Title style={{ textAlign: 'center', marginTop: '1%' }}>Edit Recipe</Card.Title>
            <Row>
              <Row className="justify-content-md-center">
                <Col xs lg="2">
                  <Form.Label>Name:</Form.Label>
                </Col>
                <Col xs lg="2">
                  <Form.Control
                    type="text"
                    value={this.recipe.name}
                    onChange={(event) => (this.recipe.name = event.currentTarget.value)}
                    style={{ margin: '1%' }}
                  />
                </Col>
              </Row>

              <Row className="justify-content-md-center">
                <Col xs lg="2">
                  Country:
                </Col>
                <Col xs lg="2">
                  <Form.Select
                    value={this.recipe.country}
                    onChange={(event) => (this.recipe.country = event.currentTarget.value)}
                    style={{ margin: '1%' }}
                  >
                    {this.recipes
                      .map((recipe) => recipe.country)
                      .filter((country, index, array) => array.indexOf(country) === index)
                      .map((country, i) => (
                        <option key={i} value={country}>
                          {country}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Row>

              <Row className="justify-content-md-center">
                <Col xs lg="2">
                  <Form.Label>Category:</Form.Label>
                </Col>
                <Col xs lg="2">
                  <Form.Select
                    value={this.recipe.category}
                    onChange={(event) => (this.recipe.category = event.currentTarget.value)}
                    style={{ margin: '1%' }}
                  >
                    {this.recipes
                      .map((recipe) => recipe.category)
                      .filter((category, index, array) => array.indexOf(category) === index)
                      .map((category, i) => (
                        <option key={i} value={category}>
                          {category}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Row>
            </Row>
          </Card>
          {/* Card for mapping ingredients, amount and measurement unit */}
          <Card
            style={{
              borderTop: 'none',
              borderRight: 'none',
              borderLeft: 'none',
              textAlign: 'center',
              marginTop: '1%',
            }}
          >
            <Card.Title>Recipe Details</Card.Title>
            <Row className="justify-content-md-center">
              <Col>
                Amount per Person
                {this.recipeIngredients.map((recipeIngredient) => (
                  <Row key={recipeIngredient.ingredient_id}>
                    <Form.Control
                      value={recipeIngredient.amount_per_person}
                      type="number"
                      onChange={(event) =>
                        (recipeIngredient.amount_per_person = Number(event.currentTarget.value))
                      }
                    ></Form.Control>
                  </Row>
                ))}
              </Col>

              <Col>
                Measurement unit
                {this.recipeIngredients.map((recipeIngredient) => (
                  <Row key={recipeIngredient.ingredient_id}>
                    <Form.Control
                      value={recipeIngredient.measurement_unit}
                      type="text"
                      onChange={(event) =>
                        (recipeIngredient.measurement_unit = event.currentTarget.value)
                      }
                    ></Form.Control>
                  </Row>
                ))}
              </Col>

              <Col>
                Ingredient
                {this.recipeIngredients.map((recipeIngredient) => (
                  <Row key={recipeIngredient.ingredient_id}>
                    <Form.Control
                      value={recipeIngredient.name}
                      type="text"
                      onChange={(event) => (recipeIngredient.name = event.currentTarget.value)}
                    ></Form.Control>
                  </Row>
                ))}
              </Col>
            </Row>
          </Card>
          {/* Card for mapping steps */}
          <Card
            style={{
              margin: '2%',
              textAlign: 'center',
              border: 'none',
            }}
          >
            <Card.Title>Steps</Card.Title>
            <Row>
              <Col>
                <ol>
                  {this.steps.map((step) => (
                    <li>
                      <Row key={step.step_id}>
                        {' '}
                        <Form.Control
                          value={step.description}
                          type="text"
                          onChange={(event) => (step.description = event.currentTarget.value)}
                          style={{
                            width: '80%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: '1%',
                          }}
                        ></Form.Control>
                      </Row>
                    </li>
                  ))}
                </ol>
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col>
                <Button
                  style={{ width: '30%', textAlign: 'center', margin: '2%' }}
                  variant="success"
                  onClick={() => this.updateRecipe()}
                >
                  Save
                </Button>

                <Button
                  style={{ width: '30%' }}
                  variant="danger"
                  onClick={() => this.deleteRecipe()}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </Card>
        </Container>
      </>
    );
  }

  mounted() {
    recipeService.getAll().then((recipes) => (this.recipes = recipes));
    recipeService
      .get(this.props.match.params.id)
      .then((recipe) => (this.recipe = recipe))
      .then(() => recipeService.getRecipeIngredients(this.recipe.recipe_id))
      .then((recipeIngredients) => (this.recipeIngredients = recipeIngredients))
      .then(() => recipeService.getSteps(this.recipe.recipe_id))
      .then((steps) => (this.steps = steps))
      .catch((error) => Alert.danger('Error getting recipe details: ' + error.message));
  }

  deleteRecipe() {
    recipeService
      .delete(this.recipe.recipe_id)
      .then(() => {
        Alert.info('Recipe was deleted');
        history.push('/recipes/');
      })
      .catch((error) => Alert.danger('Error deleting recipe: ' + error.message));
  }

  updateRecipe() {
    recipeService
      .update(this.recipe)
      .then(() => {
        this.recipeIngredients.map((ing) => {
          recipeService
            .updateRecipeIngredient(
              Number(ing.amount_per_person),
              ing.measurement_unit,
              this.recipe.recipe_id,
              ing.ingredient_id,
              ing.name
            )
            .catch((error) => Alert.danger('Error updating ingredient: ' + error.message));
        });
        this.steps.map((step) => {
          recipeService
            .updateStep(this.recipe.recipe_id, step.step_id, step.order_number, step.description)
            .catch((error) => Alert.danger('Error updating step: ' + error.message));
        });
      })
      .catch((error) => Alert.danger('Error updating recipe' + error.message));

    /// workaround to make sure the recipe is updated before pushing to another path
    setTimeout(() => {
      history.push('/recipes/' + this.recipe.recipe_id);
      //@ts-ignore
    }, '500');
  }
}
