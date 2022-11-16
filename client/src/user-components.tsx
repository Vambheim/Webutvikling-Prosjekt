import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Column } from './widgets';
import { Button, Form, Card, Row, Col, Container } from 'react-bootstrap';
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

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a recipe

export class UserLogIn extends Component {
  email: string = '';
  password: string = '';

  render() {
    return (
      <Card
        style={{
          border: 'none',
          padding: '15px',
          textAlign: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {/*Card forms in for log in screen */}
        <Card.Title>Log in</Card.Title>
        <Container style={{ width: '20rem', marginLeft: 'auto', marginRight: 'auto' }}>
          <Row>
            <Form.Control
              value={this.email}
              type="text"
              placeholder="Email"
              onChange={(event) => (this.email = event.currentTarget.value)}
              style={{
                textAlign: 'center',
                marginBottom: '10px',
              }}
            ></Form.Control>
          </Row>
          <Row>
            <Form.Control
              value={this.password}
              type="password"
              placeholder="Password"
              onChange={(event) => (this.password = event.currentTarget.value)}
              // Makes it possible to log in with enter as well as with button
              onKeyUp={(event) => {
                if (event.key == 'Enter') {
                  this.logIn();
                }
              }}
              style={{
                textAlign: 'center',
                marginBottom: '10px',
              }}
            ></Form.Control>
          </Row>
        </Container>
        {/*Card for buttons in login screen before user is identified or registered */}
        <Container style={{ width: '15rem', marginLeft: 'auto', marginRight: 'auto' }}>
          <Row>
            <Button
              variant="success"
              onClick={() => this.logIn()}
              style={{
                marginBottom: '10px',
              }}
            >
              Log in
            </Button>
          </Row>
          <Row>
            <Button
              variant="outline-success"
              onClick={() => this.createUser()}
              style={{
                marginBottom: '10px',
              }}
            >
              No user? Create one here
            </Button>
          </Row>
          <Row>
            <Button
              variant="outline-success"
              onClick={() => this.clearInput()}
              style={{
                marginBottom: '10px',
              }}
            >
              Clear input
            </Button>
          </Row>
        </Container>
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
      <Card
        style={{
          border: 'none',
          padding: '15px',
          textAlign: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {/* Card creating forms related to creating new user */}
        <Card.Title>Create user</Card.Title>
        <Container
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '20rem',
          }}
        >
          <Row>
            <Form.Control
              value={this.user.email}
              type="text"
              placeholder="Email"
              onChange={(event) => (this.user.email = event.currentTarget.value)}
              style={{
                marginBottom: '10px',
                textAlign: 'center',
              }}
            ></Form.Control>
          </Row>
          <Row>
            <Form.Control
              value={this.user.first_name}
              type="text"
              placeholder="First name"
              onChange={(event) => (this.user.first_name = event.currentTarget.value)}
              style={{
                marginBottom: '10px',
                textAlign: 'center',
              }}
            ></Form.Control>
          </Row>
          <Row>
            <Form.Control
              value={this.user.last_name}
              type="text"
              placeholder="Last name"
              onChange={(event) => (this.user.last_name = event.currentTarget.value)}
              style={{
                marginBottom: '10px',
                textAlign: 'center',
              }}
            ></Form.Control>
          </Row>
          <Row>
            <Form.Control
              value={this.user.password}
              type="password"
              placeholder="Password"
              onChange={(event) => (this.user.password = event.currentTarget.value)}
              // Makes it possible to log in with enter as well as with button
              onKeyUp={(event) => {
                if (event.key == 'Enter') {
                  this.createUser();
                }
              }}
              style={{
                marginBottom: '10px',
                textAlign: 'center',
              }}
            ></Form.Control>
          </Row>
          <Row>
            <Form.Control
              value={this.confirm_password}
              type="password"
              placeholder="Confirm password"
              onChange={(event) => (this.confirm_password = event.currentTarget.value)}
              onKeyUp={(event) => {
                if (event.key == 'Enter') {
                  this.createUser();
                }
              }}
              style={{
                marginBottom: '10px',
                textAlign: 'center',
              }}
            ></Form.Control>
          </Row>
        </Container>
        {/* Buttons for creating user and clearing input */}
        <Container style={{ width: '15rem', marginLeft: 'auto', marginRight: 'auto' }}>
          <Row>
            <Button
              variant="success"
              onClick={() => this.createUser()}
              style={{
                marginBottom: '10px',
              }}
            >
              Create user
            </Button>
          </Row>
          <Row>
            <Button
              variant="outline-success"
              onClick={() => this.clearInput()}
              style={{
                marginBottom: '10px',
              }}
            >
              Clear input
            </Button>
          </Row>
        </Container>
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
      .catch((error) => Alert.danger(error.response.data));
  }

  clearInput() {
    this.user = { user_id: 0, email: '', first_name: '', last_name: '', password: '' };
    this.confirm_password = '';
  }
}

export class UserDetails extends Component {
  likedRecipes: Recipe[] = [];
  render() {
    return (
      <>
        <Card
          style={{
            // border: 'none',
            padding: '15px',
            textAlign: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {/* Page for all relevant user info for logged in user */}
          <Card.Title>
            {'User page for ' + currentUser.first_name + ' ' + currentUser.last_name}
          </Card.Title>
          <Row style={{ fontSize: '17px' }}>
            <Card.Text>Your email-adress: {currentUser.email}</Card.Text>
          </Row>
          <Row style={{ fontSize: '17px' }}>
            <Card.Text>
              Your name: {currentUser.first_name} {currentUser.last_name}
            </Card.Text>
          </Row>
          <Row>
            <Button
              variant="outline-danger"
              onClick={() => this.logOut()}
              style={{
                width: '15rem',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '10px',
              }}
            >
              Log out
            </Button>
          </Row>
        </Card>

        {/* Card retrieving active users liked recipes */}
        <Card
          style={{
            border: 'none',
            padding: '15px',
            textAlign: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Card.Title>Your liked recipes</Card.Title>
          <Row>
            <Col lg>
              <Row xs={1} md={4} className="g-4">
                {this.likedRecipes.map((recipe) => (
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
                        <Card.Img variant="top" src="https://s.tihlde.org/recipechef12312" />
                        <Card.Body>
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
            </Col>
          </Row>
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
