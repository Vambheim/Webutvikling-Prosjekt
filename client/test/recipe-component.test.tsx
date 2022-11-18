import * as React from 'react';
import { Component } from 'react-simplified';
import { shallow } from 'enzyme';
import { Col } from 'react-bootstrap';
import { Column, Alert } from '../src/widgets';
import { RecipeDetails, RecipeEdit, RecipeAdd, RecipeList } from '../src/recipe-components';
import recipeService, { Recipe } from '../src/recipe-service';
import { Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

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

    addItemToShoppingList() {
      return Promise.resolve({
        ingredient_id: 1,
        amount_per_person: 2,
        measurement_unit: 'DL',
      });
    }

    openIngredient() {}

    saveRecipe() {
      return Promise.resolve({
        recipe_id: 1098350,
        name: 'Light Greek Lemon Chicken Orzo Soup',
        category: 'soup',
        country: 'Mediterranean',
      });
    }
    getRecipeIngredient() {
      return Promise.resolve({
        ingredient_id: 1001,
        recipe_id: 632101,
        amount_per_person: 0.5,
        measurement_unit: 'cup',
      });
    }

    /*addIngredient() {
      return Promise.resolve({
        name: 'carrot',
        amount: '2',
        measurement_unit: 'units',
      });
    }*/
  }
  return new RecipeService();
});

describe('RecipeList tests', () => {
  test('RecipeList draws correctly', (done) => {
    const wrapper = shallow(<RecipeList />);

    // Wait for events to complete
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('Add filter button draws correctly ', (done) => {
    const wrapper = shallow(<RecipeList />);

    wrapper.find(Button).at(0).simulate('click');

    // Wait for events to complete
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('Add filter button draws correctly ', (done) => {
    const wrapper = shallow(<RecipeList />);

    wrapper.find(Button).at(1).simulate('click');

    // Wait for events to complete
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('Remove filters draws correctly', (done) => {
    const wrapper = shallow(<RecipeList />);

    wrapper.find(Button).at(2).simulate('click');

    // Wait for events to complete
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('SearchBar handles change', () => {
    const wrapper = shallow(<RecipeList />);

    wrapper.find(Form.Control).simulate('change', { currentTarget: { value: 'Pannekaker' } });

    expect(wrapper.containsMatchingElement(<Form.Control value="Pannekaker" />)).toEqual(true);
  });
});

describe('RecipeDetails tests', () => {
  test('RecipeDetails draws correctly using snapshots', (done) => {
    const wrapper = shallow(<RecipeDetails match={{ params: { recipe_id: 1 } }} />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('RecipeDetails correctly directs to same page if logged in', (done) => {
    let loggedIn = false;
    const wrapper = shallow(<RecipeDetails match={{ params: { recipe_id: 1 } }} />);

    wrapper.find(Button).at(0).simulate('click');
    if (loggedIn) {
      setTimeout(() => {
        expect(location.hash).toEqual('#/recipes/:id');

        done();
      });
    } else {
      setTimeout(() => {
        expect(location.hash).toEqual('#/recipes/login');

        done();
      });
    }
  });

  test('RecipeDetails draws correctly', (done) => {
    const wrapper = shallow(<RecipeDetails match={{ params: { recipe_id: 1 } }} />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
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

test('Country and Category filter pushes correctly', (done) => {
  const wrapper = shallow(<RecipeDetails match={{ params: { recipe_id: 1 } }} />);
  wrapper.find(Button).at(0).simulate('click');
  setTimeout(() => {
    // $FlowExpectedError: do not type check next line.
    expect(wrapper).toMatchSnapshot();
    done();
  });
});

test('Ingredientfilter pushes correctly', (done) => {
  const wrapper = shallow(<RecipeDetails match={{ params: { recipe_id: 1 } }} />);
  wrapper.find(Button).at(1).simulate('click');
  setTimeout(() => {
    // $FlowExpectedError: do not type check next line.
    expect(wrapper).toMatchSnapshot();
    done();
  });
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
      expect(location.hash).toEqual('#/recipes/1/edit');

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
    wrapper
      .find(Form.Control)
      .at(4)
      .simulate('change', { currentTarget: { value: 2100 } });

    expect(wrapper.containsMatchingElement(<Form.Control value={2100} />)).toEqual(true);
    expect(wrapper.containsMatchingElement(<Form.Control value={2100} />)).toEqual(true);
    expect(wrapper.containsMatchingElement(<Form.Control value={2100} />)).toEqual(true);
    expect(wrapper.containsMatchingElement(<Form.Control value={2100} />)).toEqual(true);
    expect(wrapper.containsMatchingElement(<Form.Control value={2100} />)).toEqual(true);
    expect(wrapper.containsMatchingElement(<Form.Control value={2100} />)).toEqual(true);
  });
  /*
  test('Pop array delivers change', () => {
    const wrapper = shallow(<RecipeAdd />);

    wrapper.find(Button).at(3).simulate('click');

    expect(wrapper.containsMatchingElement());
  });
  */
});

describe('RecipeEdit tests', () => {
  test('RecipeEdit draws correctly (using snapshot)', (done) => {
    const wrapper = shallow(<RecipeEdit match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
  /*
  test('EditRecipe correctly sets location save', (done) => {
    const wrapper = shallow(<RecipeEdit match={{ params: { id: 1 } }} />);

    wrapper.find(Button).at(1).simulate('click');

    expect(location.hash).toEqual('#/');

    done();
  });
  
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
