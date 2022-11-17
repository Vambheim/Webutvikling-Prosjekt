import * as React from 'react';
import { Component } from 'react-simplified';
import { shallow } from 'enzyme';
import { Col } from 'react-bootstrap';
import { Column, Alert } from '../src/widgets';
import { RecipeDetails, RecipeEdit } from '../src/recipe-components';
import recipeService, { Recipe } from '../src/recipe-service';

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
  }
  return new RecipeService();
});

class RecipeList extends Component {
  recipes: Recipe[] = [];

  render() {
    return (
      <>
        Tasks:
        {this.recipes.map((recipe) => (
          <div key={recipe.recipe_id}>{recipe.name}</div>
        ))}
      </>
    );
  }

  mounted(): void {
    recipeService.getAll().then((recipes) => (this.recipes = recipes));
  }
}

describe('Component tests', () => {
  test('RecipeList draws correctly', (done) => {
    const wrapper = shallow(<RecipeList />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <div>Butter Brie</div>,
          <div>Three Ingredient Frozen Pina Colada</div>,
          <div>Rotisserie Chicken and Bean Tostadas</div>,
        ])
      ).toEqual(true);

      done();
    });
  });
});

describe('RecipeDetails tests', () => {
  test('MovieOverview draws correctly', (done) => {
    const wrapper = shallow(<RecipeDetails match={{ params: { id: 1098370 } }} />);

    // Wait for events to complete
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
