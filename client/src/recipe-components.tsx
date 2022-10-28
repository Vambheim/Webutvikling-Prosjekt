import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import taskService, { Recipe, User } from './recipe-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
/**
 * Renders task list.
 */
export class RecipeList extends Component {
  countries: string[] = ['Norway', 'China']; // Midlertidig løsning frem til api er hentet
  country: string = '';
  categories: string[] = ['Fish', 'Tapas']; // Midlertidig løsning frem til api er hentet
  category: string = '';
  ingredients: string[] = ['Milk', 'Chili']; // Midlertidig løsning frem til api er hentet
  ingredient: string = '';
  recipes: Recipe[] = [
    { recipe_id: 0, name: 'Kvæfjord cake', category: 'Cake', country: 'Norway' },
    { recipe_id: 1, name: 'Sushi', category: 'Dinner', country: 'Japan' }, // Midelertidig data, skal fjernes
  ];

  filter() {
    alert('heiiiiu');
  }

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
                {this.countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Column>
            <Column width={3}>
              <Form.Select
                value={this.category}
                onChange={(event) => (this.category = event.currentTarget.value)}
              >
                {this.categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Column>
            <Column width={3}>
              <Form.Select
                value={this.ingredient}
                onChange={(event) => (this.ingredient = event.currentTarget.value)}
              >
                {this.ingredients.map((ing) => (
                  <option key={ing} value={ing}>
                    {ing}
                  </option>
                ))}
              </Form.Select>
            </Column>
            <Column>
              <Button.Success>Add filters</Button.Success>
            </Column>
          </Row>
        </Card>
        {/* Lists the recipes */}
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

  // mounted() {
  //   taskService
  //     .getAll()
  //     .then((tasks) => (this.tasks = tasks))
  //     .catch((error) => Alert.danger('Error getting tasks: ' + error.message));
  // }
}

export class RecipeDetails extends Component<{ match: { params: { recipe_id: number } } }> {
  recipe: Recipe = { recipe_id: 0, name: 'Kvæfjord cake', category: 'Cake', country: 'Norway' };
  //Skal være tom og fylles av databasekall... where recipe_id = this.props.match.params.recipe_id

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
        {/* <Button.Success
          onClick={() => history.push('/tasks/' + this.props.match.params.recipe_id + '/edit')}
        >
          Edit
        </Button.Success> */}
      </>
    );
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
  users: User[] = [
    //Skal være tom hehelolol
    { username: 'Thomas', password: '123' },
    { username: 'Ola', password: '90112' },
  ];

  test: User = { username: '', password: '' };

  autent(username_input: string, password_input: string) {
    if (this.users.some((user) => user.username === username_input)) {
      console.log('brukenavn godkjent');
    } else {
      Alert.danger('No user with username: ' + username_input + ' found');
    }

    // if (this.users.some((user) => user.password === username_input)) {
    //   console.log('brukenavn godkjent');
    // } else {
    //   Alert.danger('No user with username: ' + username_input + ' found');
    // }

    console.log('Username: ' + this.test.username);
    console.log('Password: ' + this.test.password);
  }

  reset() {}

  render() {
    return (
      <Card title="Log In">
        <Row>
          <Column width={6}>
            <Form.Input
              value={this.test.username}
              type="text"
              placeholder="Username"
              onChange={(event) => (this.test.username = event.currentTarget.value)}
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column width={6}>
            <Form.Input
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
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <br></br>
        </Row>
        <Row>
          <Column width={3}>
            <Button.Success
              onClick={() => {
                this.autent();
              }}
            >
              Log in
            </Button.Success>
          </Column>
        </Row>
      </Card>
    );
  }
}

export class TaskDetails extends Component<{ match: { params: { id: number } } }> {
  task: Task = { id: 0, title: '', done: false };

  render() {
    return (
      <>
        <Card title="Task">
          <Row>
            <Column width={2}>Title:</Column>
            <Column>{this.task.title}</Column>
          </Row>
          <Row>
            <Column width={2}>Description:</Column>
          </Row>
          <Row>
            <Column width={2}>Done:</Column>
            <Column>
              <Form.Checkbox checked={this.task.done} onChange={() => {}} disabled />
            </Column>
          </Row>
        </Card>
        <Button.Success
          onClick={() => history.push('/tasks/' + this.props.match.params.id + '/edit')}
        >
          Edit
        </Button.Success>
      </>
    );
  }

  mounted() {
    taskService
      .get(this.props.match.params.id)
      .then((task) => (this.task = task))
      .catch((error) => Alert.danger('Error getting task: ' + error.message));
  }
}

/**
 * Renders form to edit a specific task.
 */
export class TaskEdit extends Component<{ match: { params: { id: number } } }> {
  task: Task = { id: 0, title: '', done: false };

  render() {
    return (
      <>
        <Card title="Edit task">
          <Row>
            <Column width={2}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.task.title}
                onChange={(event) => (this.task.title = event.currentTarget.value)}
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
          <Row>
            <Column width={2}>Done:</Column>
            <Column>
              <Form.Checkbox
                checked={this.task.done}
                onChange={(event) => (this.task.done = event.currentTarget.checked)}
              />
            </Column>
          </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={() => Alert.info('Not yet implemented')}>Save</Button.Success>
          </Column>
          <Column right>
            <Button.Danger onClick={() => Alert.info('Not yet implemented')}>Delete</Button.Danger>
          </Column>
        </Row>
      </>
    );
  }

  mounted() {
    taskService
      .get(this.props.match.params.id)
      .then((task) => (this.task = task))
      .catch((error) => Alert.danger('Error getting task: ' + error.message));
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