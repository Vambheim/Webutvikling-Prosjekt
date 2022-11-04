import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import taskService, { Task } from './recipe-service';
import { createHashHistory } from 'history';
import {
  Card,
  Container,
  Row,
  Col,
  Carousel,
  Button,
  Form,
  Navbar,
  Nav,
  NavDropdown,
  Accordion,
} from 'react-bootstrap';
import { Column } from './widgets';

// Use history.push(...) to programmatically change path, for instance after successfully saving a student
const history = createHashHistory();

export class Home extends Component {
  render() {
    return (
      <Container style={{ flex: 'column' }}>
        <Card style={{ border: 'none', textAlign: 'center', fontFamily: 'Century Gothic' }}>
          <Card.Body>
            <Card style={{ border: 'none', textAlign: 'center' }}>
              <Card.Body>
                <Carousel>
                  <Carousel.Item interval={1500}>
                    <img
                      className="d-block w-100"
                      src="https://s.tihlde.org/burger"
                      alt="First slide"
                      width={'900px'}
                    />
                    <Carousel.Caption>
                      <h3>Burger til under 100kr</h3>
                      <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                  <Carousel.Item interval={500}>
                    <img
                      className="d-block w-100"
                      src="https://s.tihlde.org/pannekake"
                      alt="Second slide"
                    />
                    <Carousel.Caption>
                      <h3>Dessert til enhver anledning</h3>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="https://s.tihlde.org/brownie"
                      alt="Third slide"
                    />
                    <Carousel.Caption>
                      <h3>Frokost eller middag?</h3>
                      <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                </Carousel>
              </Card.Body>
              <Card.Title>
                {'Anbefalinger:'}
                <Card.Body style={{ backgroundColor: 'rgb(169, 110, 41)' }}>
                  <Row style={{ justifyContent: 'center' }}>
                    <Card
                      style={{
                        width: '18rem',
                        marginRight: '1rem',
                        backgroundColor: 'rgb(255, 235, 205)',
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src="https://s.tihlde.org/skinke"
                        style={{ marginTop: '10px' }}
                      />
                      <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                          Some quick example text to build on the card title and make up the bulk of
                          the card's content.
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                      </Card.Body>
                    </Card>
                    <Card
                      style={{
                        width: '18rem',
                        marginRight: '1rem',
                        backgroundColor: 'rgb(255, 235, 205)',
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src="https://s.tihlde.org/suppe"
                        style={{ marginTop: '10px' }}
                      />
                      <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                          Some quick example text to build on the card title and make up the bulk of
                          the card's content.
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                      </Card.Body>
                    </Card>
                    <Card
                      style={{
                        width: '18rem',
                        marginRight: '1rem',
                        backgroundColor: 'rgb(255, 235, 205)',
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src="https://s.tihlde.org/suppe"
                        style={{ marginTop: '10px' }}
                      />
                      <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                          Some quick example text to build on the card title and make up the bulk of
                          the card's content.
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                      </Card.Body>
                    </Card>
                    <Card
                      style={{
                        width: '18rem',
                        marginRight: '1rem',
                        backgroundColor: 'rgb(255, 235, 205)',
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src="https://s.tihlde.org/suppe"
                        style={{ marginTop: '10px' }}
                      />
                      <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                          Some quick example text to build on the card title and make up the bulk of
                          the card's content.
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                      </Card.Body>
                    </Card>
                  </Row>
                </Card.Body>
              </Card.Title>
            </Card>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export class RecipeList extends Component {
  tasks: Task[] = [];
  countries: string[] = ['Norway', 'China']; // Midlertidig løsning frem til api er hentet
  country: string = '';
  categories: string[] = ['Fish', 'Tapas']; // Midlertidig løsning frem til api er hentet
  category: string = '';
  ingredients: string[] = ['Milk', 'Chilli']; // Midlertidig løsning frem til api er hentet
  ingredient: string = '';

  render() {
    return (
      <div>
        <Container fluid>
          <Navbar expand="lg" variant="light" bg="">
            <Container style={{ display: 'flex', justifyContent: 'normal' }}>
              <Navbar.Brand href="">Filters:</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="m-auto" style={{ width: '50%' }}>
                  <Form.Select
                    value={this.country}
                    onChange={(event) => (this.country = event.currentTarget.value)}
                    style={{ border: 'none', marginRight: '10px' }}
                  >
                    <option key="blankChoice" hidden>
                      {'Velg land:'}
                    </option>

                    {this.countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Form.Select>

                  <Form.Select
                    value={this.category}
                    onChange={(event) => (this.category = event.currentTarget.value)}
                    style={{ border: 'none', marginRight: '10px' }}
                  >
                    <option key="blankChoice" hidden>
                      {'Velg Kategori:'}
                    </option>

                    {this.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Select
                    value={this.ingredient}
                    onChange={(event) => (this.ingredient = event.currentTarget.value)}
                    style={{ border: 'none', marginRight: '10px' }}
                  >
                    <option key="blankChoice" hidden>
                      {'Velg ingrediens'}
                    </option>
                    {this.ingredients.map((ing) => (
                      <option key={ing} value={ing}>
                        {ing}
                      </option>
                    ))}
                  </Form.Select>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Card>
            <Card.Title>
              <Card.Body>
                <Row xs={2} md={4} className="g-4">
                  {Array.from({ length: 16 }).map((_, idx) => (
                    <Col>
                      <Card>
                        <Card.Img variant="top" src="https://s.tihlde.org/brownie" />
                        <Card.Body>
                          <Card.Title>Card title</Card.Title>
                          <Card.Text>
                            This is a longer card with supporting text below as a natural lead-in to
                            additional content. This content is a little bit longer.
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card.Title>
          </Card>
        </Container>
      </div>
    );
  }
}

export class RecipeAdd extends Component {
  categories: string[] = ['Fish', 'Tapas']; // Midlertidig løsning frem til api er hentet
  category: string = '';
  recipeName: string = '';
  description: string = '';
  country: string = '';
  ingredients: string = '';
  ingredient: string[] = ['Carrot', 'Potato', 'Chicken'];

  render() {
    return (
      <Container style={{}}>
        <Card
          style={{
            border: 'none',
            textAlign: 'center',
            marginTop: '20px',
          }}
        >
          <Card.Title>New Recipe</Card.Title>
          <Card.Body>
            <Card.Text>Want to add a new recipe to our database? Add it below: </Card.Text>
          </Card.Body>
        </Card>
        <Row>
          <Col md={2}>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicname">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="Name"
                  placeholder="Enter name"
                  value={this.recipeName}
                  onChange={(event) => (this.recipeName = event.currentTarget.value)}
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicname">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="desc"
                  placeholder="Enter description"
                  value={this.description}
                  onChange={(event) => (this.description = event.currentTarget.value)}
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicname">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="Country"
                  placeholder="Enter country"
                  value={this.country}
                  onChange={(event) => (this.country = event.currentTarget.value)}
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
              Kategori
              <Form.Select
                value={this.category}
                onChange={(event) => (this.category = event.currentTarget.value)}
              >
                <option key="Category" hidden></option>
                {this.categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
              <Form.Group className="collapse" controlId="formBasicIngredient" hidden>
                <Form.Label>Ingredients</Form.Label>
                <Form.Control
                  type="Ingredient"
                  placeholder="Enter Ingredient"
                  value={this.ingredients}
                  onChange={(event) => (this.ingredients = event.currentTarget.value)}
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
              <Accordion defaultActiveKey="1" flush style={{ marginTop: '10px' }}>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Add ingredients</Accordion.Header>
                  <Accordion.Body>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Form>
          </Col>
          <Col className="justify-content-md-center" md={{ span: 4, offset: 2 }}>
            <Card style={{ width: '26rem', textAlign: 'center', marginTop: '7%' }}>
              <Card.Img variant="top" src="https://s.tihlde.org/burger" />
              <Card.Body>
                <Card.Title>{this.recipeName}</Card.Title>
                <Card.Text> {this.description}</Card.Text>
                <Card.Text>{this.country}</Card.Text>
                <Card.Text>{this.category}</Card.Text>

                <Button variant="primary" data-toggle="collapse" data-target="#formBasicIngredient">
                  Gå videre
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
