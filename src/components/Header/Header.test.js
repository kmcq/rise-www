import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';

it('renders the Nav', () => {
  const wrapper = shallow(<Header />);
  const nav = wrapper.find('Nav');
  expect(nav.length).toEqual(1);
  expect(nav.prop('withDonate')).toEqual(true);
});
