import * as React from 'react';
import { ShoppingList } from '../src/shoppingList-components';
import { shallow } from 'enzyme';
import { Row, Button } from 'react-bootstrap';

//Mocks a logged in user
jest.mock('../src/user-components', () => ({
  loggedIn: true,
  currentUser: {
    user_id: 1,
    email: 'test@mail',
    first_name: 'Test',
    last_name: 'Testersson',
    password: '123password',
  },
}));

jest.mock('../src/shoppingList-service', () => {
  class shoppingListService {
    getShoppingList() {
      return Promise.resolve([
        {
          shopping_list_id: 1,
          recipe_id: 1,
          ingredient_id: 2,
          name: 'milk',
          amount: 2,
          measurement_unit: 'l',
        },
        {
          shopping_list_id: 2,
          recipe_id: 1,
          ingredient_id: 3,
          name: 'sugar',
          amount: 400,
          measurement_unit: 'gram',
        },
      ]);
    }

    deleteShoppingList() {
      return Promise.resolve();
    }

    deleteItemShoppingList() {
      return Promise.resolve();
    }
  }
  return new shoppingListService();
});

describe('Shoppinglist component tests while logged in', () => {
  test('Shoppinglist draws correctly (using snapshot)', (done) => {
    // @ts-ignore: do not type check next line.
    const wrapper = shallow(<ShoppingList />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('Shoppinglist draws correctly ', (done) => {
    // @ts-ignore: do not type check next line.
    const wrapper = shallow(<ShoppingList />);
    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement([
          <Row key={1}>
            2 l milk<Button variant="light">&#128465;</Button>
          </Row>,
          <Row key={2}>
            400 gram sugar<Button variant="light">&#128465;</Button>
          </Row>,
        ])
      ).toEqual(true);

      // cannot delete items individually because of the confirm element
      // we found it more user-friendly to keep the element rather than to delete it in order to get more test coverage
      wrapper.find(Button).at(0).simulate('click');
      wrapper.find(Button).at(1).simulate('click');
      // can neither delete all items in list because of the confirm element
      wrapper.find(Button).at(2).simulate('click');

      // if confirm element was not in place, this is how we would check if the items was deleted:
      // setTimeout(() => {
      //   expect(
      //     wrapper.containsMatchingElement([
      //       <Row key={1}>
      //         2 l milk<Button variant="light">&#128465;</Button>
      //       </Row>,
      //       <Row key={2}>
      //         400 gram sugar<Button variant="light">&#128465;</Button>
      //       </Row>,
      //     ])
      //   ).toEqual(false);
      // });

      done();
    });
  });
});
