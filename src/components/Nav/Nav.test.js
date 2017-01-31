import React from 'react';
import { shallow } from 'enzyme';
import Nav from './Nav';
import { DONATE_LINK } from '../../lib/constants';

const links = [
  { name: 'ABOUT', path: '/about', indexLevels: [0, 2] },
  { name: 'PROGRAMS', path: '/programs', indexLevels: [1] },
  { name: 'GET INVOLVED', path: '/get-involved' },
  { name: 'RESOURCES', path: '/resources' },
  { name: 'NEWS', path: '/news' }
];

it('renders the donate button if withDonate is true', () => {
  const wrapper = shallow(<Nav path="/" withDonate />);
  expect(wrapper.find({ href: DONATE_LINK }).length).toEqual(1);
});

it('does not render the donate button if withDonate is false', () => {
  const wrapper = shallow(<Nav path="/" />);
  expect(wrapper.find({ href: DONATE_LINK }).length).toEqual(0);
});

it('assigns the active field based on path', () => {
  const wrapper = shallow(<Nav links={links} path="/get-involved" />);
  expect(wrapper.find('.Nav-link-active').prop('to')).toEqual('/get-involved');
});

it('assigns the active field based on path and indexLevels', () => {
  const wrapper = shallow(<Nav links={links} path="/" />);
  expect(wrapper.find('.Nav-link-active').prop('to')).toEqual('/about');
});

it('assigns the active field based on indexLevels longer than the link', () => {
  const wrapper = shallow(<Nav links={links} path="/about/mission" />);
  expect(wrapper.find('.Nav-link-active').prop('to')).toEqual('/about');
});

it('prepends hrefs with the relativePath prop', () => {
  const wrapper = shallow(<Nav links={links} path="/test/about" relativePath="/test" />);
  const linkProps = { children: 'ABOUT' };
  expect(wrapper.find(linkProps).prop('to')).toEqual('/test/about');
});

it('assigns the active field correctly with the relativePath prop', () => {
  const wrapper = shallow(<Nav links={links} path="/test/about" relativePath="/test" />);
  expect(wrapper.find('.Nav-link-active').prop('to')).toEqual('/test/about');
});

it('assigns the active field correctly with the relativePath prop and indexLevels', () => {
  const wrapper = shallow(<Nav links={links} path="/test" relativePath="/test" />);
  expect(wrapper.find('.Nav-link-active').prop('to')).toEqual('/test/programs');
});

it('is configurable', () => {
  const wrapper = shallow(<Nav path="/" links={links} />);
  links.forEach((link) => {
    const linkProps = {
      children: link.name,
      to: link.path
    };
    expect(wrapper.find(linkProps).length).toEqual(1);
  });
});
