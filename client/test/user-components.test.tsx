import * as React from 'react';
import { UserLogIn, RegisterUser, UserDetails } from '../src/user-components';
import { shallow } from 'enzyme';
import { NavLink } from 'react-router-dom';
import { Component } from 'react-simplified';
import { Alert, Column } from '../src/widgets';
import { Button, Form, Card, Row, Col, Container, FormControl } from 'react-bootstrap';
import recipeService, { Recipe } from '../src/recipe-service';
import userService, { User } from '../src/user-service';
import { createHashHistory } from 'history';

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

// describe('UserLogIn component tests', () => {
//   test('UserLogIn draws correctly', () => {
//     const wrapper = shallow(<UserLogIn />);

//     expect(wrapper).toMatchSnapshot();
//   });
// });

describe('RegisterUser component tests', () => {
  test('RegisterUser draws correctly', () => {
    const wrapper = shallow(<RegisterUser />);

    expect(wrapper).toMatchSnapshot();
  });
});

describe('UserDetails component tests', () => {
  test('UserDetails draws correctly', () => {
    const wrapper = shallow(<UserDetails />);

    expect(wrapper).toMatchSnapshot();
  });
});

describe('UserLogIn widgets tests', () => {
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

  // test('Button sucess calls function on click-event', () => {
  //   const wrapper = shallow(
  //     <Button variant="success" onClick={() => userService.logIn('test@mail.com', 'testPassword')}>
  //       Log in
  //     </Button>
  //   );

  //   wrapper.find('button').simulate('click');

  //   expect().toEqual('Logged in as test@mail.com');
  // });
});

// describe('Button.Success widget tests', () => {
//   test('Draws correctly', () => {
//     // @ts-ignore: do not type check next line.
//     const wrapper = shallow(<Button.Success>test</Button.Success>);

//     expect(
//       wrapper.matchesElement(
//         <button type="button" className="btn btn-success">
//           test
//         </button>
//       )
//     ).toEqual(true);
//   });
// });

// Wait for events to complete
//   setTimeout(() => {
//     expect(
//       wrapper.containsAllMatchingElements([
//         <NavLink to="/tasks/1">Les leksjon</NavLink>,
//         <NavLink to="/tasks/2">Møt opp på forelesning</NavLink>,
//         <NavLink to="/tasks/3">Gjør øving</NavLink>,
//       ])
//     ).toEqual(true);
//     done();
//   });
// });

//   test('TaskNew correctly sets location on create', (done) => {
//     const wrapper = shallow(<TaskNew />);

//     wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Kaffepause' } });
//     // @ts-ignore
//     expect(wrapper.containsMatchingElement(<Form.Input value="Kaffepause" />)).toEqual(true);

//     wrapper.find(Button.Success).simulate('click');
//     // Wait for events to complete
//     setTimeout(() => {
//       expect(location.hash).toEqual('#/tasks/4');
//       done();
//     });
//   });
// });
