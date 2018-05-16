import React from 'react';
import { shallow, mount } from 'enzyme';
import ProjectListItem from './ProjectListItem';
import 'jest-styled-components';
const repo = {
    id: '1',
    name: 'Repo',
    full_name: 'Some Repo',
    description: 'Some repo description',
    language: 'Ruby',
};

describe('ProjectListItem ', () => {
    it('renders with no props', () => {
        shallow(<ProjectListItem />);
    });

    it('renders repo with matching snapshot', () => {
        const rendered = mount(<ProjectListItem repo={repo} />);
        expect(rendered).toMatchSnapshot();
    });

    it('changes to the correct pill color', () => {
        const rendered = shallow(<ProjectListItem repo={repo} />);
        let element = rendered.find('[color]');
        expect(element.props().color).toBe("#701516")
    });
});