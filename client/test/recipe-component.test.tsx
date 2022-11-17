import * as React from 'react';
import { Component } from 'react-simplified';
import { shallow } from 'enzyme';
import { RecipeService } from '../src/recipe-service';
import { RecipeList } from 'src/recipe-components';

jest.mock('../src/recipe-service', () => {
  class RecipeService {
    getAll() {
      return Promise.resolve([
        { id: 1098370, title: 'Butter Brie', category: 'side dish', country: 'American' },
        {
          id: 1098357,
          title: 'Three Ingredient Frozen Pina Colada',
          category: 'beverage',
          country: 'Mexican',
        },
      ]);
    }
  }
  return new RecipeService();
});
