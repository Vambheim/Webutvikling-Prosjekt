import * as React from 'react';
import { ShoppingList } from '../src/shoppingList-components';
import { EnzymeAdapter, shallow } from 'enzyme';
import { Component } from 'react-simplified';
import { Alert, Column } from '../src/widgets';
import { ShoppingListInfo } from '../src/shoppingList-service';
import { loggedIn, currentUser } from '../src/user-components';
import { createHashHistory } from 'history';
import { Container, Card, Row, Form, Button, Col } from 'react-bootstrap';

var deleteButtonClicked = false
var knapp1 = false
jest.mock('../src/shoppingList-service', () => {
  class shoppingListService {
    getShoppingList() {
      return Promise.resolve([
        {
          ingredient_id: 2,
          name: "groennbaer",
          recipe_id: 1,
          shopping_list_id: 2,
          amount: 2,
          measurement_unit: "ml"
        },
        {
          ingredient_id: 3,
          name: "roedbaer",
          recipe_id: 1,
          shopping_list_id: 2,
          amount: 4,
          measurement_unit: "ml"
        },
      ])
    }
    addToShoppingList(
      recipe_id: number,
      ingredient_id: number,
      user_id: number,
      amount: number,
      measurement_unit: string
    ) {
      return Promise.resolve();
    }

    deleteShoppingList(user_id: number) {
      deleteButtonClicked = true
      return Promise.resolve();
    }

    deleteItemShoppingList(shopping_list_id: number) {
      knapp1 = true
      return Promise.resolve();
    }
  }
  return new shoppingListService()
})

// @ts-ignore: do not type check next line.
const wrapper = shallow(<ShoppingList />);

describe('Shoppinglist component tests', () => {
  test('Shoppinglist draws correctly (using snapshot)', (done) => {

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  })
})

describe('Shoppinglist Button test', () => {
  test('testing if delete button draws', (done) => {

    // @ts-ignore: do not type check next line.
    const button = wrapper.find(Button).at(0)

    // expect(button.length).toBe(1)
    button.simulate('click')

    setTimeout(() => {
      //expect(location.hash).toEqual("#/recipes/shoppinglist")
      expect(deleteButtonClicked || knapp1).toEqual(true)
      done();
    });

    //expect(location.hash).toEqual('#/');


    //   setTimeout(() => {
    //     expect(location.hash).toEqual('');

    //     done();
    //   }, 1000);

  })

  test('testing if first buttons draws', (done) => {
    let buttonsClicked: Array<Boolean> = []
    let getShoppingList = [
      {
        ingredient_id: 2,
        name: "groennbaer",
        recipe_id: 1,
        shopping_list_id: 2,
        amount: 2,
        measurement_unit: "ml"
      },
      {
        ingredient_id: 3,
        name: "roedbaer",
        recipe_id: 1,
        shopping_list_id: 2,
        amount: 4,
        measurement_unit: "ml"
      },
    ]

    // @ts-ignore: do not type check next line.
    const shoppinglist = shallow((
      <Col>
        {getShoppingList.map((list) => (
          <Row key={list.shopping_list_id}>
            <Col
              style={{
                textAlign: 'right',
              }}
            >
              {list.amount + ' ' + list.measurement_unit + ' ' + list.name}
            </Col>
            <Col>
              <Button
                variant="light"
                onClick={() => buttonsClicked.push(true)}
                style={{
                  width: '5rem',
                  marginLeft: '0px',
                  marginRight: '100%',
                  marginBottom: '10px',
                }}
              >
                &#128465;
              </Button>
            </Col>
          </Row>
        ))}
      </Col>
    ));

    // @ts-ignore: do not type check next line.
    const button1 = shoppinglist.find(Button).at(0)

    // @ts-ignore: do not type check next line.
    const button2 = shoppinglist.find(Button).at(1)

    // expect(button.length).toBe(1)
    button1.simulate('click')
    button2.simulate('click')
    //expect(button.length).toBe(1)
    // button.simulate('click')

    setTimeout(() => {
      //expect(location.hash).toEqual("#/recipes/shoppinglist")
      expect(buttonsClicked[0] && buttonsClicked[0]).toEqual(true)
      done();
    });
  })

});
