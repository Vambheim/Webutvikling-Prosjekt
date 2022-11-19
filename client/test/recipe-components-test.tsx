import * as React from 'react';
import { Component } from 'react-simplified';
import { shallow } from 'enzyme';
import taskService, { Recipe } from '../src/recipe-service';

jest.mock('../src/task-service', () => {
  class TaskService {
    getAll() {
      return Promise.resolve([
        { id: , title: 'Les leksjon', done: false },
        { id: 2, title: 'Møt opp på forelesning', done: false },
      ]);
    }
  }
  return new TaskService();
});
