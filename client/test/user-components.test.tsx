import * as React from 'react';
import { UserLogIn, RegisterUser, UserDetails } from '../src/user-components';
import { shallow } from 'enzyme';

import { Button, Form, Card } from 'react-bootstrap';

jest.mock('../src/user-service', () => {
  class UserService {
    createUser(
      email: 'test@mail.com',
      first_name: 'testFirstName',
      last_name: 'testLastName',
      password: 'testPassword'
    ) {
      return Promise.resolve({
        user_id: 1,
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

jest.mock('../src/recipe-service', () => {
  class RecipeService {
    getLikedRecipes(user_id: 1) {
      return Promise.resolve([
        {
          recipe_id: 631748,
          name: 'Asian Shrimp Stir-Fry',
          category: 'lunch',
          country: 'Asian',
        },
        {
          recipe_id: 631807,
          name: 'Toasted" Agnolotti (or Ravioli)',
          category: 'side dish',
          country: 'Mediterranean',
        },
      ]);
    }
  }
  return new RecipeService();
});

describe('UserLogIn component tests', () => {
  test('UserLogIn draws correctly', () => {
    const wrapper = shallow(<UserLogIn />);

    expect(wrapper).toMatchSnapshot();
  });

  test('Input updates correctly', () => {
    const wrapper = shallow(<UserLogIn />);

    // @ts-ignore: do not type check next line.
    expect(wrapper.containsMatchingElement(<Form.Control value="" />)).toEqual(true);

    wrapper
      .find(Form.Control)
      .at(0)
      .simulate('change', { currentTarget: { value: 'test1' } });

    wrapper
      .find(Form.Control)
      .at(1)
      .simulate('change', { currentTarget: { value: 'test2' } });

    // @ts-ignore: do not type check next line.
    expect(wrapper.containsMatchingElement(<Form.Control value="test1" />)).toEqual(true);
    expect(wrapper.containsMatchingElement(<Form.Control value="test2" />)).toEqual(true);
  });

  test('Button variant = sucess calls function on click-event', () => {
    const wrapper = shallow(<UserLogIn />);

    wrapper.find(Button).at(0).simulate('click');

    setTimeout(() => {
      expect(location.hash).toEqual('#/recipes/user');
    });
  });

  test('Button variant = outline-secondary calls function on click-event', () => {
    const wrapper = shallow(<UserLogIn />);

    wrapper.find(Button).at(1).simulate('click');
    wrapper.find(Button).at(2).simulate('click');

    setTimeout(() => {
      expect(location.hash).toEqual('#/recipes/user');
      expect(location.hash).toEqual('#/recipes/login');
    });
  });
});

describe('RegisterUser component tests', () => {
  test('RegisterUser draws correctly', () => {
    const wrapper = shallow(<RegisterUser />);

    expect(wrapper).toMatchSnapshot();
  });

  test('Input updates correctly', () => {
    const wrapper = shallow(<RegisterUser />);

    // @ts-ignore: do not type check next line.
    expect(wrapper.containsMatchingElement(<Form.Control value="" />)).toEqual(true);

    wrapper
      .find(Form.Control)
      .at(0)
      .simulate('change', { currentTarget: { value: 'test1' } });

    wrapper
      .find(Form.Control)
      .at(1)
      .simulate('change', { currentTarget: { value: 'test2' } });

    wrapper
      .find(Form.Control)
      .at(2)
      .simulate('change', { currentTarget: { value: 'test3' } });

    wrapper
      .find(Form.Control)
      .at(3)
      .simulate('change', { currentTarget: { value: 'test4' } });

    // @ts-ignore: do not type check next line.

    expect(wrapper.containsMatchingElement(<Form.Control value="test1" />)).toEqual(true);
    expect(wrapper.containsMatchingElement(<Form.Control value="test2" />)).toEqual(true);
    expect(wrapper.containsMatchingElement(<Form.Control value="test3" />)).toEqual(true);
    expect(wrapper.containsMatchingElement(<Form.Control value="test4" />)).toEqual(true);
  });

  test('Button variant = sucess calls function on click-event', () => {
    const wrapper = shallow(<RegisterUser />);

    wrapper.find(Button).at(0).simulate('click');

    setTimeout(() => {
      expect(location.hash).toEqual('#/recipes/login');
    });
  });

  test('Button variant = outline-secondary calls function on click-event', () => {
    const wrapper = shallow(<RegisterUser />);

    wrapper.find(Button).at(1).simulate('click');

    setTimeout(() => {
      expect(location.hash).toEqual('#/recipes/register');
    });
  });
});

describe('UserDetails component tests', () => {
  test('UserDetails draws correctly', () => {
    const wrapper = shallow(<UserDetails />);

    expect(wrapper).toMatchSnapshot();
  });

  test('Button variant = outline-danger calls function on click-event', () => {
    const wrapper = shallow(<UserDetails />);

    wrapper.find(Button).at(0).simulate('click');

    setTimeout(() => {
      expect(location.hash).toEqual('#/recipes');
    });
  });

  test('Test if the component contains 2 Cards', () => {
    const wrapper = shallow(<UserDetails />);

    expect(wrapper.find(Card)).toHaveLength(2);
  });
});
