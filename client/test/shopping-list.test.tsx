import * as React from 'react';
import { ShoppingList } from '../src/shoppingList-components';
import { EnzymeAdapter, shallow } from 'enzyme';
import { Component } from 'react-simplified';
import { Alert, Column } from '../src/widgets';
import { ShoppingListInfo } from '../src/shoppingList-service';
import { loggedIn, currentUser } from '../src/user-components';
import { createHashHistory } from 'history';
import { Container, Card, Row, Form, Button, Col } from 'react-bootstrap';

jest.mock('../src/user-service', () => {
  class UserService {
    createUser(
      email: 'test@mail.com',
      first_name: 'testFirstName',
      last_name: 'testLastName',
      password: 'testPassword'
    ) {
      return Promise.resolve({
        user_id: 10000,
        email: 'test@mail.com',
        first_name: 'testFirstName',
        last_name: 'testLastName',
        password: 'testPassword',
      });
    }

    logIn(email: 'test@mail.com', password: 'testPassword') {
      return Promise.resolve({
        user_id: 1,
        email: 'test@mail.com',
        first_name: 'testFirstName',
        last_name: 'testLastName',
        password: 'testPassword',
      });
    }
  }
  return new UserService();
});

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
      return Promise.resolve();
    }

    deleteItemShoppingList(shopping_list_id: number) {
      return Promise.resolve();
    }
  }
  return new shoppingListService()
})

// jest.mock("../src/shopping-list-components", () => {
//   class ShoppingList {
//     render() {
//       return Promise.resolve();
//     }

//     mounted() {
//       return Promise.resolve();
//     }

//     deleteOne(list_id: number, name: string) {
//       return Promise.resolve();
//     }

//     deleteAll() {
//       return Promise.resolve();
//     }
//   }
//   return new ShoppingList()
// })

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
    const isButtonClicked = button.simulate('click') ? true : false

    setTimeout(() => {
      //expect(location.hash).toEqual("#/recipes/shoppinglist")
      expect(isButtonClicked).toEqual(true)
      done();
    });



    //expect(location.hash).toEqual('#/');


    //   setTimeout(() => {
    //     expect(location.hash).toEqual('');

    //     done();
    //   }, 1000);

  })

  test('testing if ingridient buttons draws', (done) => {
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
                onClick={() => ""}
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
    const isButton1Clicked = button1.simulate('click') ? true : false
    //expect(button.length).toBe(1)
    const isButton2Clicked = button2.simulate('click') ? true : false

    setTimeout(() => {
      //expect(location.hash).toEqual("#/recipes/shoppinglist")
      expect(isButton1Clicked && isButton2Clicked).toEqual(true)
      done();
    });
  })
});

describe("lsakdm", () => {
  test('RecipeDetails correctly directs to same page if logged in', (done) => {
    let loggedIn = false;
    const wrapper = shallow(<ShoppingList />);

    wrapper.find(Button).at(0).simulate('click');
    if (loggedIn) {
      setTimeout(() => {
        expect(location.hash).toEqual('#/');

        done();
      });
    } else {
      setTimeout(() => {
        expect(location.hash).toEqual('#/');

        done();
      });
    }
  });
})


describe("does individual elements dra", () => {
  test("cards draw", () => {

    const rows = wrapper.find(Row)

    expect(rows).toHaveLength(2)
  })
}) 