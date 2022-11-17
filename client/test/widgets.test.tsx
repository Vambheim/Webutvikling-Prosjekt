import * as React from 'react';
import { shallow } from 'enzyme';
import { Column, Alert } from '../src/widgets';
import { Component } from 'react-simplified';

describe('Column widget tests', () => {
  test('Draws correctly', () => {
    const wrapper = shallow(<Column>test</Column>);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('New alert test', () => {
  test('No alerts initially', () => {
    const wrapper = shallow(<Alert />);

    expect(wrapper.matchesElement(<div></div>)).toEqual(true);
  });

  test('Show alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });
  test('Alert.danger draws correctly with classname', () => {
    //@ts-ignore
    const wrapper = shallow(<Alert.danger>test</Alert.danger>);

    expect(wrapper).toMatchSnapshot();
  });

  test('Alert.success draws correctly with classname', () => {
    //@ts-ignore
    const wrapper = shallow(<Alert.success>test</Alert.success>);

    expect(wrapper).toMatchSnapshot();
  });

  test('Button.Primary draws correctly with classname and style', () => {
    //@ts-ignore
    const wrapper = shallow(<Alert.warning>test</Alert.warning>);
    //console.log(wrapper.debug());

    expect(wrapper).toMatchSnapshot();
  });

  test('Button.info draws correctly with classname', () => {
    //@ts-ignore
    const wrapper = shallow(<Alert.info>test</Alert.info>);
    //console.log(wrapper.debug());

    expect(wrapper).toMatchSnapshot();
  });

  test('Show alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });

  test('Alert draws correctly with classname', () => {
    const wrapper = shallow(<Alert>test</Alert>);

    expect(wrapper).toMatchSnapshot();
  });

  test('Alert.danger draws correctly with classname', () => {
    //@ts-ignore
    const wrapper = shallow(<Alert.danger>test</Alert.danger>);

    expect(wrapper).toMatchSnapshot();
  });
});
