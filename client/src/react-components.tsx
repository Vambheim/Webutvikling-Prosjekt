import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import taskService, { Task } from './recipe-service';
import { createHashHistory } from 'history';
import { Card, Container, Row, Col, Carousel, Button } from 'react-bootstrap';

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
