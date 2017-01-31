import React from 'react';
import { shallow } from 'enzyme';
import Footer from '.';

it('renders', () => {
  shallow(<Footer />);
});

it('renders the DonateCTA', () => {
  const wrapper = shallow(<Footer />);
  expect(wrapper.find('DonateCTA').length).toEqual(2);
});
