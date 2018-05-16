import React from 'react';
import { mount } from 'enzyme';
import Loader from './Loader';

describe('Loader', () => {
    it('matches snapshot', () => {
        const rendered = mount(<Loader />);
        expect(rendered).toMatchSnapshot()
    });
});