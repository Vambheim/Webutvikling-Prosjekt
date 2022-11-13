import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import recipeService, { Recipe } from './recipe-service';
import userService, { User } from './user-service';
import { createHashHistory } from 'history';

//false as default
export let loggedIn: boolean = false;
export let currentUser: User = {
  user_id: 0,
  email: '',
  first_name: '',
  last_name: '',
  password: '',
};
// Sjekke om man kan lagre dette i local storage, er teit hvis man blir "logga ut" hvis man refresher siden

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a recipe

export class UserLogIn extends Component {
  email: string = '';
  password: string = '';

  render() {
    return (
      <Card title="Log In">
        <Row>
          <Column width={6}>
            <Form.Input
              value={this.email}
              type="text"
              placeholder="Email"
              onChange={(event) => (this.email = event.currentTarget.value)}
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
                  this.logIn();
                }
              }}
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column>
            <Button.Success onClick={() => this.logIn()}>Log in</Button.Success>
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

  logIn() {
    if (this.email.length != 0 && this.password.length != 0) {
      userService
        .logIn(this.email, this.password)
        .then((user) => {
          currentUser = user;
          loggedIn = true;
          Alert.success('Logged in as ' + currentUser.email);
          history.push('/recipes/user');
        })
        .catch((error) => Alert.danger(error.response.data));
    } else {
      Alert.danger('Please fill in all the fields');
    }
  }

  clearInput() {
    this.email = '';
    this.password = '';
  }

  createUser() {
    history.push('/recipes/register');
  }
}

export class RegisterUser extends Component {
  user: User = { user_id: 0, email: '', first_name: '', last_name: '', password: '' };
  confirm_password: string = '';

  render() {
    return (
      <Card title="Create your user here">
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
            <Button.Light onClick={() => this.clearInput()}>Clear</Button.Light>
          </Column>
        </Row>
      </Card>
    );
  }

  createUser() {
    userService
      .createUser(
        this.user.email,
        this.user.first_name,
        this.user.last_name,
        this.user.password,
        this.confirm_password
      )
      .then((response) => {
        if (response.length > 0) {
          Alert.danger(response);
        } else {
          Alert.success('User created, please log in');
          loggedIn = true;
          history.push('/recipes/login');
        }
      })
      .catch((error) => console.log('Error creating user: ' + error.message));
  }

  clearInput() {
    this.user = { user_id: 0, email: '', first_name: '', last_name: '', password: '' };
    this.confirm_password = '';
  }
}

//her må det endres litt greier vvvvvvvv
export class UserDetails extends Component {
  likedRecipes: Recipe[] = [];
  render() {
    return (
      <>
        <Card title={'User page for ' + currentUser.first_name + ' ' + currentUser.last_name}>
          <Row>
            <Column>Welcome to your unique user page</Column>
          </Row>
          <Row>
            <Column>Tips for this website:</Column>
          </Row>
          <Row>
            <Column>Email: {currentUser.email}</Column>
          </Row>
          <Row>
            <Column>
              <Button.Danger onClick={() => this.logOut()}>Log out</Button.Danger>
            </Column>
          </Row>
        </Card>
        <Card title="Liked recipes">
          {this.likedRecipes.map((recipe) => (
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
    if (!loggedIn) {
      history.push('/recipes/login');
    } else {
      recipeService
        .getLikedRecipes(currentUser.user_id)
        .then((recipes) => (this.likedRecipes = recipes))
        .catch((error) => Alert.danger(error.message));
    }
  }

  logOut() {
    loggedIn = false;
    history.push('/recipes');
    currentUser = { user_id: 0, email: '', first_name: '', last_name: '', password: '' };
  }
}
