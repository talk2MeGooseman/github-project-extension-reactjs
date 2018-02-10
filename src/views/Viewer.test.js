import React from 'react';
import { shallow } from 'enzyme';
import Viewer from './Viewer';
import GithubProjectsPanel from '../components/GithubProjectsPanel';

jest.mock('../services/Ebs.js');

describe('Viewer', () => {

    beforeEach(() => {
        window.Twitch = {
            ext: {
                onAuthorized: () => {}
            }
        }
    });

    afterEach(() => {
        window.Twitch = undefined;
    });

    it('renders without crashing', () => {
        shallow(<Viewer />);
    });


    it('should render GithubProjectPanel in a loading state', () => {
        const rendered = shallow(<Viewer />);
        expect(rendered).toContainReact(<GithubProjectsPanel user={null} loading={true} repos={null} />);
    });

    it('should set error if Twitch auth failed', () => {
        const myMock = jest.fn((func) => { func(null); });

        window.Twitch.ext.onAuthorized = myMock;

        const rendered = shallow(<Viewer />);

        expect(myMock.mock.calls.length).toBe(1);
        expect(rendered.state().loading).toBe(false);
        expect(rendered).toContainReact(<GithubProjectsPanel user={null} loading={false} repos={null}/>);
    });

    xit('should fetch data if authed and render it', () => {
        const dataProps = { user: { github_user: {avatar_url: '', login: ''} }, repos: [] };
        const myMock = jest.fn((func) => { func({}); });

        window.Twitch.ext.onAuthorized = myMock;

        const rendered = shallow(<Viewer />);

        expect(myMock.mock.calls.length).toBe(1);
        expect(rendered.state().loading).toBe(false);
        expect(rendered.state().error).toBe(false);
        expect(rendered).toContainReact(<GithubProjectsPanel loading={false} {...dataProps} />);
    });
});