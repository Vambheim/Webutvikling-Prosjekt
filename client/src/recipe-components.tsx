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
        <Card title="Search" style={{ border: 'none' }}>
          <Card.Title style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Search for a recipe
          </Card.Title>

          <Row
            style={{
              textAlign: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
              fontFamily: 'worksans',
            }}
          >
            <Column>
              <Form.Control
                onChange={(event) => this.search(event.currentTarget.value)}
                value={this.search_input}
                type="search"
                placeholder="Search"
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  textAlign: 'center',
                  width: '24rem',
                }}
              ></Form.Control>
            </Column>
          </Row>
        </Card>
        <Column>
          <Card
            style={{ borderLeft: 'none', borderTop: 'none', borderBottom: 'none', margin: '5%' }}
          >
            <Card style={{ width: '12rem', border: 'none', textAlign: 'center' }}>
              <Card.Title>Filter by country and Category:</Card.Title>
              <Row>
                <Column>Country:</Column>
              </Row>
              <Row>
                <Column>
                  <Form.Select
                    value={this.country}
                    onChange={(event) => (this.country = event.currentTarget.value)}
                    style={{ marginBottom: '10%', width: 'auto' }}
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
                  <Row>
                    {' '}
                    <Column>Category:</Column>
                  </Row>
                  <Row>
                    <Form.Select
                      value={this.category}
                      onChange={(event) => (this.category = event.currentTarget.value)}
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
                  </Row>
                </Column>
              </Row>
              <Button
                variant="success"
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
              }}
            >
              <Card.Title> Filter by ingredient: </Card.Title>
              <Row>
                <Column>
                  <Form.Select
                    value={this.ingredient1['name']}
                    onChange={(event) => (this.ingredient1['name'] = event.currentTarget.value)}
                    style={{ marginBottom: '5%' }}
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
                </Column>
              </Row>
              <Row>
                <Column>
                  <Form.Select
                    value={this.ingredient2['name']}
                    style={{ marginBottom: '5%' }}
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
                </Column>
                <Row>
                  <Column>
                    <Form.Select
                      value={this.ingredient3['name']}
                      onChange={(event) => (this.ingredient3['name'] = event.currentTarget.value)}
                      style={{ width: '115%' }}
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
                  </Column>
                </Row>
              </Row>
              <Row>
                <Button
                  variant="success"
                  onClick={() => this.addIngredientFilter()}
                  style={{
                    width: '40%',

                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginBlock: '5%',
                  }}
                >
                  Add filters
                </Button>

                <Row>
                  <Button
                    variant="danger"
                    onClick={() => this.removeFilter()}
                    style={{
                      width: '70%',

                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginBlock: '5%',
                    }}
                  >
                    Remove filters
                  </Button>
                </Row>
              </Row>
            </Card>
          </Card>
        </Column>
        <Container>
          <Row>
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
                        }}
                      >
                        <Card.Body>
                          <Card.Title style={{ color: 'rgb(82, 130, 101)' }}>
                            {' '}
                            {recipe.name}
                          </Card.Title>
                          <Card.Text>Click here for more information</Card.Text>
                        </Card.Body>
                      </Card>
                    </Column>
                  </NavLink>
                ))}
              </Row>
            </Col>
          </Row>
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
            <Row className="justify-content-md-center">
              <Col xs lg="2">
                Name:
              </Col>
              <Col>{this.recipe.name}</Col>
            </Row>
            <Row>
              <Col xs lg="2">
                Category:
              </Col>
              <Col>{this.recipe.category}</Col>
            </Row>
            <Row>
              <Col xs lg="2">
                Country:
              </Col>
              <Col>{this.recipe.country}</Col>
            </Row>
            <Row>
              <Column>
                <Button variant="light" onClick={() => this.likeRecipe()}>
                  Like this recipe &#10084;
                </Button>
              </Column>
              <Column right>
                <Button variant="success" onClick={() => this.editRecipe()}>
                  Edit
                </Button>
              </Column>
            </Row>
          </Card>
          <Card
            style={{
              borderLeft: 'none',
              borderRight: 'none',
              borderTop: 'none',
              paddingBottom: '3%',
              borderRadius: '0px',
            }}
            title="This is how you make it"
          >
            <ol>
              {this.steps.map((step) => (
                <Row key={step.order_number}>
                  <Column>
                    <li>{step.description}</li>
                  </Column>
                </Row>
              ))}
            </ol>
          </Card>
          <Card
            style={{
              borderLeft: 'none',
              borderRight: 'none',
              borderTop: 'none',
              paddingBottom: '3%',
            }}
            title="Ingredients"
          >
            <Row>
              <Column width={2}>Select portions:</Column>
              <Column width={6}>
                <Form.Control
                  type="number"
                  value={this.portions}
                  onChange={(event) => (this.portions = Number(event.currentTarget.value))}
                  min={1}
                  max={50}
                ></Form.Control>
              </Column>
            </Row>
            {this.ingredients.map((ing) => (
              <Row key={ing.ingredient_id}>
                <Column width={2}>
                  {(ing.amount_per_person * this.portions).toFixed(2) +
                    ' ' +
                    ing.measurement_unit +
                    ' ' +
                    ing.name}
                </Column>
                <Column>
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
                </Column>
              </Row>
            ))}
            <Row>
              <Column>
                <Button variant="success" onClick={() => this.addAllToShoppingList()}>
                  Add all ingredients to shopping list
                </Button>
              </Column>
            </Row>
          </Card>
          <Card title="You may also like these recipes">
            {this.recomended_recipes.map((recipe) => (
              <Row key={recipe.recipe_id}>
                <Column>
                  <NavLink to={'/recipes/' + recipe.recipe_id}>{recipe.name}</NavLink>
                </Column>
              </Row>
            ))}
          </Card>
        </Container>
      </>
    );
  }

  mounted() {
    recipeService
      .get(this.props.match.params.recipe_id)
      .then((recipe) => (this.recipe = recipe))
      //endre til navn getRecipeSteps ?
      .then(() => recipeService.getSteps(this.recipe.recipe_id))
      .then((steps) => (this.steps = steps))
      .then(() => recipeService.getRecipeIngredients(this.recipe.recipe_id))
      .then((ingredients) => (this.ingredients = ingredients))
      .then(() =>
        recipeService.getRecommendedRecipes(
          this.props.match.params.recipe_id,
          this.recipe.category,
          this.recipe.country
        )
      )
      .then((recipes) => (this.recomended_recipes = recipes))
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
        // alt kræsjer hvis man får en annen sql-feil en at man ikke kan ha flere rader med samme nøkkel
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
  //amount må være number, men da fungerer ikke placeholder

  stepCounter: number = 1;
  steps: addStep[] = [];
  step: addStep = { description: '', order_number: this.stepCounter };

  render() {
    return (
      <>
        <Container>
          <Row>
            <Column>
              <Card
                title="Add Recipe"
                style={{
                  borderLeft: '0',
                  borderRight: '0',
                  borderTop: '0',
                  borderRadius: '0',
                  padding: '10%',
                }}
              >
                <Card.Title style={{ textAlign: 'center' }}>Add your new recipe here:</Card.Title>

                <Container fluid>
                  <Row className="justify-content-md-center">
                    <Col xs lg="7">
                      <Row>
                        <Form.Control
                          value={this.recipe.name}
                          type="text"
                          placeholder="Name"
                          onChange={(event) => (this.recipe.name = event.currentTarget.value)}
                          style={{
                            textAlign: 'center',
                            width: '100%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '5px',
                          }}
                        ></Form.Control>
                      </Row>
                      <Row>
                        <Form.Control
                          // vurdere å endre denne til drop down /select
                          value={this.recipe.category}
                          type="text"
                          placeholder="Category"
                          onChange={(event) => (this.recipe.category = event.currentTarget.value)}
                          style={{
                            textAlign: 'center',
                            width: '100%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '5px',
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
                            width: '100%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '5px',
                          }}
                        ></Form.Control>
                      </Row>
                    </Col>
                  </Row>
                </Container>
                <Row
                  style={{
                    textAlign: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: '20px',
                  }}
                >
                  Choose the number of portions for this recipe:
                </Row>
                <Form.Control
                  value={this.portions}
                  type="number"
                  // placeholder={'Number of portions'}
                  min={0}
                  onChange={(event) => (this.portions = Number(event.currentTarget.value))}
                  style={{ marginLeft: 'auto', marginRight: 'auto', width: '5rem' }}
                ></Form.Control>

                <Row style={{ marginLeft: 'auto', marginRight: 'auto', margin: '1%' }}>
                  <Button variant="light" onClick={() => this.openIngredient()}>
                    Continue to add ingredients
                  </Button>
                </Row>
              </Card>

              <Container fluid>
                <div
                  style={{
                    // @ts-ignore
                    visibility: this.showIng,
                  }}
                >
                  <Row>
                    <Card
                      style={{
                        borderBottom: '1',
                        borderTop: '0',
                        borderLeft: '0',
                        borderRight: '0',
                        marginTop: '5%',

                        paddingBottom: '10%',
                      }}
                    >
                      <Card.Title style={{ textAlign: 'center' }}>Add Ingredients:</Card.Title>
                      <Card.Text style={{ textAlign: 'center' }}>Choose amount:</Card.Text>
                      <Row>
                        <Form.Control
                          value={this.ingredient.amount}
                          type="number"
                          min={1}
                          onChange={(event) =>
                            (this.ingredient.amount = Number(event.currentTarget.value))
                          }
                          style={{
                            textAlign: 'center',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '1%',
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
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '1%',
                          }}
                          // HADDE VÆRT BEST MED PRE-DEFINERTE ENHETER OG DROP DOWN
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
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}
                        ></Form.Control>
                      </Row>
                      <Row>
                        <Button
                          style={{ width: '50%' }}
                          variant="light"
                          onClick={() => this.addIngredient()}
                        >
                          +{' '}
                        </Button>

                        <Button
                          style={{ width: '50%' }}
                          variant="light"
                          onClick={() => this.undoIngredient()}
                        >
                          &#x1F519;
                        </Button>
                      </Row>

                      <Row style={{ textAlign: 'left', marginTop: '1%' }}>
                        {this.ingredients.map((ing, i) => (
                          <Row key={i}>
                            <li>{ing.amount + ' ' + ing.measurement_unit + ' ' + ing.name}</li>
                          </Row>
                        ))}
                      </Row>

                      <Row style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                        <Column>
                          <Button variant="light" onClick={() => this.openStep()}>
                            Continue to add steps
                          </Button>
                        </Column>
                      </Row>
                    </Card>
                  </Row>
                </div>
              </Container>

              <div
                style={{
                  //@ts-ignore
                  visibility: this.showSteps,
                }}
              >
                <Card style={{ border: 'none', marginTop: '5%', paddingBottom: '40%' }}>
                  <Card.Title style={{ textAlign: 'center' }}>Add steps</Card.Title>
                  <Row className="justify-content-md-center">
                    <Form.Control
                      value={this.step.description}
                      type="text"
                      placeholder="Step"
                      onChange={(event) => (this.step.description = event.currentTarget.value)}
                      style={{
                        textAlign: 'center',
                        width: '95%',
                      }}
                    ></Form.Control>

                    <Row>
                      <Button
                        style={{ width: '50%' }}
                        variant="light"
                        onClick={() => this.addStep()}
                      >
                        +
                      </Button>
                      <Button
                        style={{ width: '50%' }}
                        variant="light"
                        onClick={() => this.undoStep()}
                      >
                        &#x1F519;
                      </Button>
                    </Row>
                  </Row>
                  {this.steps.map((step) => (
                    <Row key={step.order_number}>
                      <Column>{step.order_number + ': ' + step.description}</Column>
                    </Row>
                  ))}
                </Card>
              </div>
            </Column>
            <Col sm>
              <Card
                style={{
                  width: '18rem',

                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: '30%',
                }}
              >
                <Card.Body style={{ textAlign: 'center' }}>
                  <Card.Title>Your recipe:</Card.Title>
                  <Card.Title className="mb-2 text-muted">
                    {}
                    {' ' + this.recipe.name}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {' ' + this.recipe.category}
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">
                    {' ' + this.recipe.country}
                  </Card.Subtitle>
                  <Card.Subtitle>
                    {' '}
                    {this.ingredients.map((ing, i) => (
                      <Row key={i}>
                        <li>{ing.amount + ' ' + ing.measurement_unit + ' ' + ing.name}</li>
                      </Row>
                    ))}
                  </Card.Subtitle>
                  <Card.Subtitle>
                    {this.steps.map((step) => (
                      <Row key={step.order_number}>
                        <Column>{step.order_number + ': ' + step.description}</Column>
                      </Row>
                    ))}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
              <Card style={{ border: 'none' }}>
                <Button
                  style={{
                    marginTop: '10%',
                    margin: 'auto',
                  }}
                  variant="success"
                  onClick={() => this.saveRecipe()}
                >
                  Save recipe
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  // mounted() {}

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
      Alert.danger('Add some ingredients to continue');
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
    recipeService
      .createRecipe(this.recipe.name, this.recipe.country, this.recipe.category)
      .then((recipe_id) => {
        this.ingredients.map((ing) =>
          recipeService
            .createRecipeIngredients(
              ing.name,
              recipe_id,
              ing.amount / this.portions,
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
  }
}

export class RecipeEdit extends Component<{ match: { params: { id: number } } }> {
  // recipeIngredient: RecipeIngredient = {
  //   ingredient_id: 0,
  //   name: '',
  //   recipe_id: 0,
  //   amount_per_person: 0,
  //   measurement_unit: '',
  // };

  recipeIngredients: RecipeIngredient[] = [];

  recipe: Recipe = { recipe_id: 0, name: '', category: '', country: '' };

  recipes: Recipe[] = [];
  steps: Step[] = [];
  ingredients: Ingredient[] = [];
  ingredient: Ingredient = { ingredient_id: 0, name: '' };

  render() {
    return (
      <>
        <Card title="Edit Recipe">
          <Card title="Recipe information">
            <Row>
              <Column width={2}>
                <Form.Label>Name:</Form.Label>
              </Column>
              <Column>
                <Form.Control
                  type="text"
                  value={this.recipe.name}
                  onChange={(event) => (this.recipe.name = event.currentTarget.value)}
                />
              </Column>
            </Row>

            <Row>
              <Column width={2}>Country:</Column>
              <Column>
                <Form.Select
                  value={this.recipe.country}
                  onChange={(event) => (this.recipe.country = event.currentTarget.value)}
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
              </Column>
            </Row>

            <Row>
              <Column width={2}>
                <Form.Label>Category:</Form.Label>
              </Column>
              <Column>
                <Form.Select
                  value={this.recipe.category}
                  onChange={(event) => (this.recipe.category = event.currentTarget.value)}
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
              </Column>
            </Row>
          </Card>

          <Card title="Ingredients">
            <Row>
              <Column width={2}>
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
              </Column>

              <Column width={2}>
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
              </Column>

              <Column>
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
              </Column>
            </Row>
          </Card>
          <Card title="Steps">
            <Column>
              <ol>
                {this.steps.map((step) => (
                  <Row key={step.step_id}>
                    <li>
                      {' '}
                      <Form.Control
                        value={step.description}
                        type="text"
                        onChange={(event) => (step.description = event.currentTarget.value)}
                      ></Form.Control>
                    </li>
                  </Row>
                ))}
              </ol>
            </Column>
          </Card>

          <Row>
            <Column>
              <Button variant="success" onClick={() => this.updateRecipe()}>
                Save
              </Button>
            </Column>
            <Column right>
              <Button variant="danger" onClick={() => this.deleteRecipe()}>
                Delete
              </Button>
            </Column>
          </Row>
        </Card>
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
              ing.amount_per_person,
              ing.measurement_unit,
              this.recipe.recipe_id,
              ing.ingredient_id,
              ing.name
            )
            .then((response) => console.log(response))
            .catch((error) => Alert.danger('Error updating ingredient: ' + error.message));
        });
        this.steps.map((step) => {
          recipeService
            .updateStep(this.recipe.recipe_id, step.step_id, step.order_number, step.description)
            .then((response) => console.log(response))
            .catch((error) => Alert.danger('Error updating step: ' + error.message));
        });
      }) // legge til for steps også her
      .then(() => history.push('/recipes/' + this.recipe.recipe_id))
      .catch((error) => Alert.danger('Error updating recipe' + error.message));
  }
}
