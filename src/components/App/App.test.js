import React from 'react';
import { shallow } from 'enzyme';
import App from '.';

it('renders the Header', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find('Connect(Header)').length).toEqual(1);
});

it('renders the Footer', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find('Footer').length).toEqual(1);
});
