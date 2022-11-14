import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import recipeService, {
  Recipe,
  Step,
  RecipeIngredient,
  Ingredient,
  addIngredient,
  addStep,
} from './recipe-service';
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
        <Card title="Filter by country and category">
          <Row>
            <Column width={3}>Country:</Column>
            <Column width={3}>Category:</Column>
          </Row>
          <Row>
            <Column width={3}>
              <Form.Select
                value={this.country}
                onChange={(event) => (this.country = event.currentTarget.value)}
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
            </Column>
            <Column width={3}>
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
            </Column>
          </Row>
          <Button.Success onClick={() => this.addCountryAndOrCategoryFilter()}>
            Add filters
          </Button.Success>
        </Card>
        <Card title="Filter by ingredient">
          <Row>
            <Column width={3}>Ingredient</Column>
            <Column width={3}>Ingredient</Column>
            <Column width={3}>Ingredient</Column>
          </Row>
          <Row>
            <Column width={3}>
              <Form.Select
                value={this.ingredient1['name']}
                onChange={(event) => (this.ingredient1['name'] = event.currentTarget.value)}
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
            <Column width={3}>
              <Form.Select
                value={this.ingredient2['name']}
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
            <Column width={3}>
              <Form.Select
                value={this.ingredient3['name']}
                onChange={(event) => (this.ingredient3['name'] = event.currentTarget.value)}
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
              <Button.Success onClick={() => this.addIngredientFilter()}>
                Add ingredient filters
              </Button.Success>
              <Button.Danger onClick={() => this.removeFilter()}>Remove filters</Button.Danger>
            </Column>
          </Row>
        </Card>

        <Card title="Search">
          <Column>
            <Form.Input
              onChange={(event) => this.search(event.currentTarget.value)}
              value={this.search_input}
              type="search"
              placeholder="Search"
            ></Form.Input>
          </Column>
        </Card>
        <Card title="Recepies">
          {this.filtered_recipes.map((recipe) => (
            <Row key={recipe.recipe_id}>
              <Column>
                <NavLink
                  to={'/recipes/' + recipe.recipe_id}
                  style={{
                    color: '#9FC1C0',
                    textDecoration: 'none',
                  }}
                >
                  {recipe.name}
                </NavLink>
              </Column>
            </Row>
          ))}
        </Card>
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
        <Card title={'Recipe for ' + this.recipe.name}>
          <Row>
            <Column width={2}>Name:</Column>
            <Column>{this.recipe.name}</Column>
          </Row>
          <Row>
            <Column width={2}>Category:</Column>
            <Column width={2}>{this.recipe.category}</Column>
          </Row>
          <Row>
            <Column width={2}>Country:</Column>
            <Column width={2}>{this.recipe.country}</Column>
          </Row>
          <Row>
            <Column>
              <Button.Light onClick={() => this.likeRecipe()}>
                Like this recipe &#10084;
              </Button.Light>
            </Column>
            <Column right>
              <Button.Success onClick={() => this.editRecipe()}>Edit</Button.Success>
            </Column>
          </Row>
        </Card>
        <Card title="This is how you make it">
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
        <Card title="Ingredients">
          <Row>
            <Column width={2}>Select portions:</Column>
            <Column width={6}>
              <Form.Input
                type="number"
                value={this.portions}
                onChange={(event) => (this.portions = Number(event.currentTarget.value))}
                min={1}
                max={50}
              ></Form.Input>
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
                <Button.Light
                  onClick={() =>
                    this.addItemToShoppingList(
                      ing.ingredient_id,
                      ing.amount_per_person,
                      ing.measurement_unit
                    )
                  }
                >
                  &#128722;
                </Button.Light>
              </Column>
            </Row>
          ))}
          <Row>
            <Column>
              <Button.Success onClick={() => this.addAllToShoppingList()}>
                Add all ingredients to shopping list
              </Button.Success>
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
        <Card title="Add Recipe">
          <Row>
            <Column>You can add your favourite recipe here</Column>
          </Row>
          <Row>
            <Column width={3}>
              <Form.Input
                value={this.recipe.name}
                type="text"
                placeholder="Name"
                onChange={(event) => (this.recipe.name = event.currentTarget.value)}
              ></Form.Input>
            </Column>
          </Row>
          <Row>
            <Column width={3}>
              <Form.Input
                // vurdere å endre denne til drop down /select
                value={this.recipe.category}
                type="text"
                placeholder="Category"
                onChange={(event) => (this.recipe.category = event.currentTarget.value)}
              ></Form.Input>
            </Column>
          </Row>
          <Row>
            <Column width={3}>
              <Form.Input
                value={this.recipe.country}
                type="text"
                placeholder="Country"
                onChange={(event) => (this.recipe.country = event.currentTarget.value)}
              ></Form.Input>
            </Column>
          </Row>
          <Row>
            <Row>
              <Column>Choose the number of portions for this recipe:</Column>
            </Row>
            <Column width={3}>
              <Form.Input
                value={this.portions}
                type="number"
                // placeholder={'Number of portions'}
                min={1}
                onChange={(event) => (this.portions = Number(event.currentTarget.value))}
              ></Form.Input>
            </Column>
          </Row>
          <Row>
            <Column>
              <Button.Light onClick={() => this.openIngredient()}>
                Continue to add ingredients
              </Button.Light>
            </Column>
          </Row>
        </Card>
        <div
          style={{
            // @ts-ignore
            visibility: this.showIng,
          }}
        >
          <Card title="Add ingredients">
            <Row>
              <Column>Choose amount for this ingredient:</Column>
            </Row>
            <Row>
              <Column width={3}>
                <Form.Input
                  value={this.ingredient.amount}
                  type="number"
                  min={1}
                  onChange={(event) => (this.ingredient.amount = Number(event.currentTarget.value))}
                ></Form.Input>
              </Column>
            </Row>
            <Row>
              <Column width={3}>
                <Form.Input
                  value={this.ingredient.measurement_unit}
                  type="text"
                  placeholder="Measurement unit"
                  // HADDE VÆRT BEST MED PRE-DEFINERTE ENHETER OG DROP DOWN
                  onChange={(event) =>
                    (this.ingredient.measurement_unit = event.currentTarget.value)
                  }
                ></Form.Input>
              </Column>
            </Row>
            <Row>
              <Column width={3}>
                <Form.Input
                  value={this.ingredient.name}
                  type="text"
                  placeholder="Ingredient"
                  onChange={(event) => (this.ingredient.name = event.currentTarget.value)}
                ></Form.Input>
              </Column>
              <Column>
                <Button.Light onClick={() => this.addIngredient()}>+ </Button.Light>
                <Button.Light onClick={() => this.undoIngredient()}>&#x1F519;</Button.Light>
              </Column>
            </Row>
            {this.ingredients.map((ing, i) => (
              <Row key={i}>
                <li>{ing.amount + ' ' + ing.measurement_unit + ' ' + ing.name}</li>
              </Row>
            ))}

            <Row>
              <Column>
                <Button.Light onClick={() => this.openStep()}>Continue to add steps</Button.Light>
              </Column>
            </Row>
          </Card>
        </div>

        <div
          style={{
            //@ts-ignore
            visibility: this.showSteps,
          }}
        >
          <Card title="Add steps">
            <Row>
              <Column width={3}>
                <Form.Textarea
                  value={this.step.description}
                  type="text"
                  placeholder="Step"
                  onChange={(event) => (this.step.description = event.currentTarget.value)}
                ></Form.Textarea>
              </Column>
              <Column>
                <Button.Light onClick={() => this.addStep()}>+</Button.Light>
                <Button.Light onClick={() => this.undoStep()}>&#x1F519;</Button.Light>
              </Column>
            </Row>
            {this.steps.map((step) => (
              <Row key={step.order_number}>
                <Column>{step.order_number + ': ' + step.description}</Column>
              </Row>
            ))}
            <Row>
              <Column>
                <Button.Success onClick={() => this.saveRecipe()}>Save recipe</Button.Success>
              </Column>
            </Row>
          </Card>
        </div>
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
                <Form.Input
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
                    <Form.Input
                      value={recipeIngredient.amount_per_person}
                      type="number"
                      onChange={(event) =>
                        (recipeIngredient.amount_per_person = Number(event.currentTarget.value))
                      }
                    ></Form.Input>
                  </Row>
                ))}
              </Column>

              <Column width={2}>
                Measurement unit
                {this.recipeIngredients.map((recipeIngredient) => (
                  <Row key={recipeIngredient.ingredient_id}>
                    <Form.Input
                      value={recipeIngredient.measurement_unit}
                      type="text"
                      onChange={(event) =>
                        (recipeIngredient.measurement_unit = event.currentTarget.value)
                      }
                    ></Form.Input>
                  </Row>
                ))}
              </Column>

              <Column>
                Ingredient
                {this.recipeIngredients.map((recipeIngredient) => (
                  <Row key={recipeIngredient.ingredient_id}>
                    <Form.Input
                      value={recipeIngredient.name}
                      type="text"
                      onChange={(event) => (recipeIngredient.name = event.currentTarget.value)}
                    ></Form.Input>
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
                      <Form.Textarea
                        value={step.description}
                        type="text"
                        onChange={(event) => (step.description = event.currentTarget.value)}
                      ></Form.Textarea>
                    </li>
                  </Row>
                ))}
              </ol>
            </Column>
          </Card>

          <Row>
            <Column>
              <Button.Success onClick={() => this.updateRecipe()}>Save</Button.Success>
            </Column>
            <Column right>
              <Button.Danger onClick={() => this.deleteRecipe()}>Delete</Button.Danger>
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
