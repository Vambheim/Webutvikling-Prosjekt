import * as React from 'react';
import { ShoppingList } from '../src/shoppingList-components';
import { shallow } from 'enzyme';

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
  }
  return new shoppingListService();
});

describe('Shopping List component tests without log in', () => {
  test('Shoppinglist draws correctly when user is not logged in', (done) => {
    const wrapper = shallow(<ShoppingList />);

    // Wait for events to complete
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
