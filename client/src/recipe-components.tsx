import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import recipeService, { Recipe, Step, Ingredient, User } from './recipe-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
/**
 * Renders task list.
 */
export class RecipeList extends Component {
  country: string = '';
  category: string = '';
  recipes: Recipe[] = [];

  render() {
    return (
      <>
        <Card title="Filter">
          <Row>
            <Column width={3}>Country:</Column>
            <Column width={3}>Category:</Column>
            <Column width={3}>Ingredients:</Column>
          </Row>
          <Row>
            <Column width={3}>
              <Form.Select
                value={this.country}
                onChange={(event) => (this.country = event.currentTarget.value)}
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
            <Column width={3}>
              <Form.Select
                value={this.category}
                onChange={(event) => (this.category = event.currentTarget.value)}
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
            <Column width={3}>
              {/* <Form.Select
                // Hvordan skal vi gjøre det med filter knyttet til ingrediens?
                value={this.ingredient}
                onChange={(event) => (this.ingredient = event.currentTarget.value)}
              >
                {this.ingredients.map((ing) => (
                  <option key={ing} value={ing}>
                    {ing}
                  </option>
                ))}
              </Form.Select> */}
            </Column>
            <Column>
              <Button.Success onClick={() => this.filter()}>Add filters</Button.Success>
            </Column>
          </Row>
        </Card>

        <Card title="Recepies">
          {this.recipes.map((recipe) => (
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
      .getAll()
      .then((recipes) => (this.recipes = recipes))
      .catch((error) => Alert.danger('Error getting recipe: ' + error.message));
  }

  filter() {
    alert('jhei');
  }
}

export class RecipeDetails extends Component<{ match: { params: { recipe_id: number } } }> {
  recipe: Recipe = { recipe_id: 0, name: '', category: '', country: '' };
  steps: Step[] = [];
  ingredients: Ingredient[] = [];
  portions: number = 1;

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
          <Button.Light>Like this recipe &#10084;</Button.Light>
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
            <Column width={2}>Select portions jajja:</Column>
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
              <Column>
                {ing.amount_per_person * this.portions +
                  ' ' +
                  ing.measurement_unit +
                  ' ' +
                  ing.name}
              </Column>
            </Row>
          ))}
        </Card>

        <Button.Success
          onClick={() => history.push('/recipes/' + this.props.match.params.recipe_id + '/edit')}
        >
          Edit
        </Button.Success>
      </>
    );
  }

  mounted() {
    recipeService
      .get(this.props.match.params.recipe_id)
      .then((recipe) => (this.recipe = recipe))
      .then(() => recipeService.getSteps(this.recipe.recipe_id))
      .then((steps) => (this.steps = steps))
      .then(() => recipeService.getIngredients(this.recipe.recipe_id))
      .then((ingredients) => (this.ingredients = ingredients))
      .catch((error) => Alert.danger('Error getting recipe details: ' + error.message));
  }
}

export class RecipeAdd extends Component {
  render() {
    return (
      <Card title="Add Recipe">
        <Row>
          <Column>You can add your favourite recipe here</Column>
        </Row>
        <Row>
          <Column width={2}>
            <Form.Input type="text" placeholder="Name on dish"></Form.Input>
          </Column>
          <Column width={2}>
            <Form.Textarea type="text" rows={6} placeholder="Steps"></Form.Textarea>
          </Column>
          <Column width={2}>
            <Form.Input type="text" placeholder="Ingredient"></Form.Input>
          </Column>
          <Column width={1}>
            <Form.Select></Form.Select>
          </Column>
          <Column width={1}>
            <Button.Light>+</Button.Light>
          </Column>
        </Row>
        <Button.Success>Add recipe</Button.Success>
      </Card>
    );
  }
}

export class ShoppingList extends Component {
  ings: string[] = ['Cheese', 'Meat', 'Chicken'];

  removeOne(i: number, ing: string) {
    if (confirm('Do you want to remove ' + ing + ' from the shopping list?')) {
      // Called when OK is pressed
      this.ings.splice(i, 1);
    } else {
      console.log('Cancel');
    }
  }

  removeAll() {
    this.ings = [];
  }

  render() {
    return (
      <Card title="Shopping List">
        {this.ings.map((ing, i) => (
          <Row key={i}>
            <Row>
              <Column width={3}>{ing}</Column>
              <Column width={1}>
                <Button.Light onClick={() => this.removeOne(i, ing)} small>
                  &#128465;
                </Button.Light>
              </Column>
              <Column></Column>
            </Row>
          </Row>
        ))}
        <Button.Danger
          onClick={() => {
            this.removeAll();
          }}
        >
          Reset Shopping List
        </Button.Danger>
      </Card>
    );
  }
}

export class UserLogIn extends Component {
  email: string = '';
  user: User[] = [];

  // autent(username_input: string, password_input: string) {
  //   if (this.users.some((user) => user.username === username_input)) {
  //     console.log('brukenavn godkjent');
  //   } else {
  //     Alert.danger('No user with username: ' + username_input + ' found');
  //   }

  // if (this.users.some((user) => user.password === username_input)) {
  //   console.log('brukenavn godkjent');
  // } else {
  //   Alert.danger('No user with username: ' + username_input + ' found');
  // }

  // console.log('Username: ' + this.email);
  // }

  reset() {
    this.email = '';
  }

  render() {
    return (
      <Card title="Log In">
        <Row>
          <Column width={6}>
            <Form.Input
              value={this.email}
              type="text"
              placeholder="email"
              onChange={(event) => (this.email = event.currentTarget.value)}
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column width={6}>
            {/* <Form.Input
              value={this.test.password}
              type="password"
              placeholder="Password"
              onChange={(event) => (this.test.password = event.currentTarget.value)}
              // @ts-ignore
              // Makes it possible to log in with enter as well as with button
              onKeyUp={(event) => {
                if (event.key == 'Enter') {
                  this.autent(this.test.username, this.test.password);
                }
              }}
            ></Form.Input> */}
          </Column>
        </Row>
        <Row>
          <Column width={3}></Column>
        </Row>
      </Card>
    );
  }

  // mounted() {}
}

/**
 * Renders form to edit a specific task.
 */
export class RecipeEdit extends Component<{ match: { params: { id: number } } }> {
  recipe: Recipe = { recipe_id: 0, name: '', category: '', country: '' };
  recipes: Recipe[] = [];

  render() {
    return (
      <>
        <Card title="Edit Recipe">
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
        <Row>
          <Column>
            <Button.Success
              onClick={() =>
                recipeService
                  .update(this.recipe)
                  .then(() => history.push('/recipes/' + this.recipe.recipe_id))
                  .catch((error) => Alert.danger('Error in updating recipe: ' + error.message))
              }
              //Tror problemet over her er at category og country blir lagt i recipes og ikke i recipe
            >
              Save
            </Button.Success>
          </Column>
          <Column right>
            <Button.Danger onClick={() => Alert.info('Not yet implemented')}>Delete</Button.Danger>
          </Column>
        </Row>
      </>
    );
  }

  mounted() {
    recipeService.getAll().then((recipes) => (this.recipes = recipes));

    recipeService
      .get(this.props.match.params.id)
      .then((recipe) => (this.recipe = recipe))
      .catch((error) => Alert.danger('Error getting recipe: ' + error.message));
  }
}

/**
 * Renders form to create new task.
 */
export class TaskNew extends Component {
  title = '';

  render() {
    return (
      <>
        <Card title="New task">
          <Row>
            <Column width={2}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.title}
                onChange={(event) => (this.title = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Description:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea value="" onChange={() => {}} rows={10} disabled />
            </Column>
          </Row>
        </Card>
        <Button.Success
          onClick={() => {
            taskService
              .create(this.title)
              .then((id) => history.push('/tasks/' + id))
              .catch((error) => Alert.danger('Error creating task: ' + error.message));
          }}
        >
          Create
        </Button.Success>
      </>
    );
  }
}
