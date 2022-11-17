import * as React from 'react';
import { Component } from 'react-simplified';
import { shallow } from 'enzyme';
import { Col } from 'react-bootstrap';
import { Column, Alert } from '../src/widgets';
import { RecipeDetails, RecipeEdit, RecipeAdd, RecipeList } from '../src/recipe-components';
import recipeService, { Recipe } from '../src/recipe-service';
import { Form, Button } from 'react-bootstrap';

jest.mock('../src/recipe-service', () => {
  class RecipeService {
    getAll() {
      return Promise.resolve([
        {
          id: 1098370,
          name: 'Butter Brie',
          category: 'side dish',
          country: 'American',
        },
        {
          id: 1098357,
          name: 'Three Ingredient Frozen Pina Colada',
          category: 'beverage',
          country: 'Mexican',
        },
        {
          id: 1098354,
          name: 'Rotisserie Chicken and Bean Tostadas',
          category: 'antipasti',
          country: 'Mexican',
        },
      ]);
    }
    create() {
      return Promise.resolve(4); // Same as: return new Promise((resolve) => resolve(4));
    }

    update() {
      return Promise.resolve();
    }

    delete() {
      return Promise.resolve();
    }
    get() {
      return Promise.resolve({
        id: 1098370,
        name: 'Butter Brie',
        category: 'side dish',
        country: 'American',
      });
    }

    getAllIngredients() {
      return Promise.resolve({
        ingredient_id: 1,
        name: 'carrot',
      });
    }
  }
  return new RecipeService();
});

describe('RecipeList tests', () => {
  test('RecipeDetailds draws correctly using snapshots', (done) => {
    const wrapper = shallow(<RecipeList />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});

describe('RecipeDetails tests', () => {
  test('RecipeDetails draws correctly (using snapshot)', (done) => {
    const wrapper = shallow(<RecipeDetails match={{ params: { recipe_id: 1 } }} />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
  /* 
  test('RecipeDetails correctly likes', (done) => {
    const wrapper = shallow(<RecipeDetails match={{ params: { recipe_id: 1 } }} />);
    let loggedIn;

    wrapper.find(Button).at(0).simulate('click');
    if (loggedIn == true) {
      setTimeout(() => {
        expect(location.hash).toEqual('#/recipes');

        done();
      });
    } else {
      expect(wrapper).toMatchSnapshot();
    }
  });
});
*/
});

describe('RecipeAdd tests', () => {
  test('RecipeAdd draws correctly (using snapshot)', (done) => {
    const wrapper = shallow(<RecipeAdd />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('RecipeAdd correctly sets location save', (done) => {
    const wrapper = shallow(<RecipeAdd />);

    wrapper.find(Button).at(4).simulate('click');

    setTimeout(() => {
      expect(location.hash).toEqual('#/');

      done();
    });
  });
  test(' RecipeAdd Form delivers change', () => {
    const wrapper = shallow(<RecipeAdd />);

    wrapper
      .find(Form.Control)
      .at(0)
      .simulate('change', { currentTarget: { value: 2100 } });
    wrapper
      .find(Form.Control)
      .at(1)
      .simulate('change', { currentTarget: { value: 2100 } });
    wrapper
      .find(Form.Control)
      .at(2)
      .simulate('change', { currentTarget: { value: 2100 } });
    wrapper
      .find(Form.Control)
      .at(3)
      .simulate('change', { currentTarget: { value: 2100 } });
    wrapper
      .find(Form.Control)
      .at(4)
      .simulate('change', { currentTarget: { value: 2100 } });

    expect(wrapper.containsMatchingElement(<Form.Control value={2100} />)).toEqual(true);
    // @ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Control value={2100} />)).toEqual(true);
    // @ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Control value={2100} />)).toEqual(true);
    // @ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Control value={2100} />)).toEqual(true);
    // @ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Control value={2100} />)).toEqual(true);
  });
});

describe('RecipeEdit tests', () => {
  test('RecipeEdit draws correctly (using snapshot)', (done) => {
    const wrapper = shallow(<RecipeEdit match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
  test('EditRecipe correctly sets location save', (done) => {
    const wrapper = shallow(<RecipeEdit match={{ params: { id: 1 } }} />);

    wrapper.find(Button).at(1).simulate('click');

    expect(location.hash).toEqual('#/');

    done();
  });
  /*
  test('EditRecipe correctly sets location delete', (done) => {
    const wrapper = shallow(<RecipeEdit match={{ params: { id: 1 } }} />);

    wrapper.find(Button).at(0).simulate('click');

    expect(location.hash).toEqual('#/recipes/');

    done();
  });
  */

  test('RecipeEdit delivers change', () => {
    const wrapper = shallow(<RecipeEdit match={{ params: { id: 1 } }} />);

    wrapper.find(Form.Control).simulate('change', { currentTarget: { value: 'Pannekaker' } });

    expect(wrapper.containsMatchingElement(<Form.Control value="Pannekaker" />)).toEqual(true);
  });
});
