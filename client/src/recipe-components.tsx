import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import recipeService, { Recipe, Step, Ingredient, User } from './recipe-service';
import { createHashHistory } from 'history';

//false as default
export let loggedIn: boolean = false;
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
/**
 * Renders task list.
 */

export class RecipeList extends Component {
  country: string = '';
  category: string = '';
  recipes: Recipe[] = [];
  filtered_recipes: Recipe[] = [];

  search_input: string = '';

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

        <Card title="Search">
          <Column>
            <Form.Input
              onChange={(event) => (this.search_input = event.currentTarget.value)}
              value={this.search_input}
              type="search"
              placeholder="Search"
            ></Form.Input>
          </Column>
          <Column>
            <Button.Light onClick={() => this.search()}>Search</Button.Light>
          </Column>
        </Card>
        <Card title="Recepies">
          {this.recipes.map((recipe) => (
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
      .then((recipes) => (this.recipes = recipes))
      .catch((error) => Alert.danger('Error getting recipe: ' + error.message));
  }

  search() {
    this.recipes.map((recipe) => {
      if (this.search_input.length > 0) {
        if (recipe.name.includes(this.search_input)) {
          this.filtered_recipes.push(recipe);
          console.log(recipe.name);
        } else {
          console.log('does not match bro');
        }
      }
    });
  }

  filter() {
    Alert.danger('Not yet implemented');
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
          <Button.Light onClick={() => this.loggedInCheck()}>
            Like this recipe &#10084;
          </Button.Light>
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
              <Column width={2}>
                {ing.amount_per_person * this.portions +
                  ' ' +
                  ing.measurement_unit +
                  ' ' +
                  ing.name}
              </Column>
              <Column>
                {/* Adds to shopping list, if logged in */}
                <Button.Light onClick={() => this.loggedInCheck()}>&#128722;</Button.Light>
              </Column>
            </Row>
          ))}
          <Row>
            <Column>
              <Button.Success onClick={() => this.addIngToShoppingList()}>
                Add all ingredients to shopping list
              </Button.Success>
            </Column>
          </Row>
        </Card>

        <Button.Success
          onClick={() => {
            this.editRecipe();
          }}
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

  loggedInCheck() {
    if (!loggedIn) {
      Alert.info(`You have to log in to like this recipe`);
    }
  }

  editRecipe() {
    history.push('/recipes/' + this.props.match.params.recipe_id + '/edit');
  }

  addIngToShoppingList() {
    Alert.danger('Not yet implemented');
  }
}

export class RecipeAdd extends Component {
  steps: Step[] = [];
  ingredients: Ingredient[] = [];
  recipe: Recipe = { recipe_id: 0, name: '', category: '', country: '' };
  showIng: string = 'hidden';
  showSteps: string = 'hidden';

  render() {
    return (
      <>
        <Card title="Add Recipe">
          <Row>
            <Column>You can add your favourite recipe here</Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Input
                value={this.recipe.name}
                type="text"
                placeholder="Name"
                onChange={(event) => (this.recipe.name = event.currentTarget.value)}
              ></Form.Input>
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Input
                value={this.recipe.category}
                type="text"
                placeholder="Category"
                onChange={(event) => (this.recipe.category = event.currentTarget.value)}
              ></Form.Input>
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Input
                value={this.recipe.country}
                type="text"
                placeholder="Country"
                onChange={(event) => (this.recipe.country = event.currentTarget.value)}
              ></Form.Input>
            </Column>
          </Row>
          <Row>
            <Column>
              <Button.Light onClick={() => (this.showIng = 'visible')}>
                Continue to add ingredients
              </Button.Light>
            </Column>
          </Row>
        </Card>
        <div
          style={{
            //@ts-ignore
            visibility: this.showIng,
          }}
        >
          <Card title="Add ingredients">
            <Row>
              <Column width={2}>
                <Form.Input type="text" placeholder={'Ingredient'}></Form.Input>
              </Column>
              <Column>
                <Button.Light onClick={() => this.addIngredient()}>+</Button.Light>
              </Column>
            </Row>
            <Row>
              <Column>
                <Button.Light onClick={() => (this.showSteps = 'visible')}>
                  Continue to add steps
                </Button.Light>
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
              <Column width={2}>
                <Form.Input placeholder="Step"></Form.Input>
              </Column>
              <Column>
                <Button.Light onClick={() => this.addStep()}>+</Button.Light>
              </Column>
            </Row>
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

  saveRecipe() {
    Alert.danger('Not yet implemented');
  }

  addIngredient() {
    Alert.danger('Not yet implemented');
  }

  addStep() {
    Alert.danger('Not yet implemented');
  }
}

export class ShoppingList extends Component {
  ings: string[] = ['Cheese', 'Meat', 'Chicken'];

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

  // mounted() {
  // }

  removeOne(i: number, ing: string) {
    //må gjøres i database
    if (confirm('Do you want to remove ' + ing + ' from the shopping list?')) {
      // Called when OK is pressed
      this.ings.splice(i, 1);
    } else {
      console.log('Cancel');
    }
  }

  removeAll() {
    //må gjøres i database
    this.ings = [];
  }
}

export class UserLogIn extends Component {
  username: string = '';
  password: string = '';
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

  render() {
    return (
      <Card title="Log In">
        <Row>
          <Column width={6}>
            <Form.Input
              value={this.username}
              type="text"
              placeholder="Username"
              onChange={(event) => (this.username = event.currentTarget.value)}
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column width={6}>
            <Form.Input
              value={this.password}
              type="password"
              placeholder="Password"
              onChange={(event) => (this.password = event.currentTarget.value)}
              // @ts-ignore
              // Makes it possible to log in with enter as well as with button
              onKeyUp={(event) => {
                if (event.key == 'Enter') {
                  console.log(this.username, this.password);
                }
              }}
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column width={1}>
            <Button.Success onClick={() => this.logIn()}>Log in</Button.Success>
          </Column>
          <Column width={3}>
            <Button.Light onClick={() => this.clearInput()}>Clear</Button.Light>
          </Column>
        </Row>
        <Row>
          <Column>
            <Button.Light onClick={() => this.createUser()}>No user? Create one here</Button.Light>
          </Column>
        </Row>
      </Card>
    );
  }
  // mounted() {}

  logIn() {
    Alert.danger('Not yet implemented');
  }

  clearInput() {
    this.username = '';
    this.password = '';
  }

  createUser() {
    history.push('/recipes/register');
  }
}

export class RegisterUser extends Component {
  confirm_password: string = '';

  user: User = { username: '', first_name: '', last_name: '', password: '', email: '' };

  render() {
    return (
      <Card title="Create your user here">
        <Row>
          <Column>
            <Form.Input
              type="text"
              value={this.user.username}
              placeholder="Username"
              onChange={(event) => (this.user.username = event.currentTarget.value)}
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column>
            <Form.Input
              type="text"
              value={this.user.email}
              placeholder="Email"
              onChange={(event) => (this.user.email = event.currentTarget.value)}
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column>
            <Form.Input
              type="text"
              value={this.user.first_name}
              placeholder="First name"
              onChange={(event) => (this.user.first_name = event.currentTarget.value)}
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column>
            <Form.Input
              type="text"
              value={this.user.last_name}
              placeholder="Last name"
              onChange={(event) => (this.user.last_name = event.currentTarget.value)}
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column>
            <Form.Input
              type="password"
              value={this.user.password}
              placeholder="Password"
              onChange={(event) => (this.user.password = event.currentTarget.value)}
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column>
            <Form.Input
              type="password"
              value={this.confirm_password}
              placeholder="Confirm password"
              onChange={(event) => (this.confirm_password = event.currentTarget.value)}
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column>
            <Button.Success onClick={() => this.createUser()}>Create user</Button.Success>
          </Column>
        </Row>
        <Row>
          <Column>
            <Button.Light onClick={() => this.clearInput()}>Clear</Button.Light>
          </Column>
        </Row>
      </Card>
    );
  }

  createUser() {
    Alert.danger('Not yet implemented');
    // Psuedocode
    // if(nytt_brukernavn finnes i username[]) {
    //   alert("brukernavn finnes")
    // } if (epost finnes) {
    //   alert("epost allerede i bruk, log inn")
    // } if (!password matches) {
    // alert("passord matcher ikke")
    // } else {
    //   let hash = bcrypt.hash(passord);
    //   RecipeService.addUser(this.bruker[ passord= hash])
    // }
  }

  clearInput() {
    this.user = { username: '', first_name: '', last_name: '', password: '', email: '' };
    this.confirm_password = '';
  }
}

export class UserDetails extends Component<{ match: { params: { email: string } } }> {
  render() {
    return (
      <Card title="User details">
        <Row>
          <Column>Username:</Column>
        </Row>
      </Card>
    );
  }

  // mounted() {
  // }
}
//jalla

/**
 * Renders form to edit a specific task.
 */
export class RecipeEdit extends Component<{ match: { params: { id: number } } }> {
  recipe: Recipe = { recipe_id: 0, name: '', category: '', country: '' };
  recipes: Recipe[] = [];

  //test om branch funker
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
