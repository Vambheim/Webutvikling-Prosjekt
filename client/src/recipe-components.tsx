import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Row, Card, Column, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import taskService, { Task } from './recipe-service';
import { createHashHistory } from 'history';

import Form from 'react-bootstrap/Form';
// import Card from 'react-bootstrap/Card';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

/**
 * Renders task list.
 */
export class RecipeList extends Component {
  tasks: Task[] = [];
  countries: string[] = ['Norway', 'China']; // Midlertidig løsning frem til api er hentet
  country: string = '';
  categories: string[] = ['Fish', 'Tapas']; // Midlertidig løsning frem til api er hentet
  category: string = '';
  ingredients: string[] = ['Milk', 'Chilli']; // Midlertidig løsning frem til api er hentet
  ingredient: string = '';

  filter() {
    alert('heiiiiu');
  }

  render() {
    return (
      <>
        <Card title="Recipes">
          {this.tasks.map((task) => (
            <Row key={task.id}>
              <Column>
                <NavLink to={'/tasks/' + task.id}>{task.title}</NavLink>
              </Column>
            </Row>
          ))}
        </Card>
        <Card title="Filter">
          <Row>
            <Column width={2}>Country:</Column>
            <Column width={2}>Country:</Column>
            <Column width={2}>Category:</Column>
            <Column width={2}>Ingredients:</Column>
          </Row>
          <Row>
            <Column width={2}>
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

            <Column width={2}></Column>
            <Column width={2}>
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
            <Column width={2}>
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
              <Button.Success>Add filters </Button.Success>
              <Button.Light>Like this recipe &#10084;</Button.Light>
              {/* For bruk til å like oppskrifter senere */}
            </Column>
          </Row>
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

export class RecipeAdd extends Component {
  categories: string[] = ['Fish', 'Tapas']; // Midlertidig løsning frem til api er hentet
  category: string = '';

  render() {
    return (
      <Card title="Add Recipe">
        <Row>
          <Column>You can add your favourite recipe here</Column>
        </Row>
        <Row>
          <Column width={4}>
            <Form.Label htmlFor="inputName">Name of dish</Form.Label>
            <Form.Control type="text" id="dishName" aria-describedby="dishHelpBlocl" />
            <Form.Text id="dishHelpBlock" muted>
              Please insert the name of the desired dish above
            </Form.Text>
          </Column>

          <Column width={4}>
            <Form.Label htmlFor="Steps">Steps</Form.Label>
            <Form.Control type="text" id="dishSteps" aria-describedby="stepsHelpBlock" />
            <Form.Text id="stepsHelpBlock" muted>
              Please insert a step in making the current dish above
            </Form.Text>
          </Column>
          <Column width={4}>
            <Form.Label htmlFor="Ingredient">Ingredient</Form.Label>
            <Form.Control type="text" id="ingredient" aria-describedby="ingredientHelpBlock" />
            <Form.Text id="ingredientHelpBlock" muted>
              Please insert the name of an ingredient in the current dish above
            </Form.Text>
          </Column>
          <Column width={1}>
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
          <Column width={1}>
            <Button.Light>+</Button.Light>
          </Column>
        </Row>
        <br />
        <Button.Success>Add recipe </Button.Success>
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

/**
 * Renders a specific task.
 */
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
