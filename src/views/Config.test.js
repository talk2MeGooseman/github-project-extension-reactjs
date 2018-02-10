import React from 'react';
import { shallow } from 'enzyme';
import Config from './Config';

jest.mock('../services/Ebs.js');

describe('Config', () => {

    beforeEach(() => {
        window.Twitch = {
            ext: {
                onAuthorized: (cb) => { cb(); }
            }
        }
    });

    afterEach(() => {
        window.Twitch = undefined;
    });

    it('renders without crashing', () => {
        shallow(<Config />);
    });

    it('should display error if auth failed', () => {
        const rendered = shallow(<Config />);
        expect(rendered.state('loading')).toEqual(false);
        expect(rendered.state('error')).toEqual(true);
        expect(rendered.contains(<div className="mui--bg-danger">Opps, something went wrong. Please try again.</div>)).toEqual(true);
    });

    it('should render step 2', () => {
        window.Twitch.ext.onAuthorized = (cb) => { cb({}) };
        
        const rendered = shallow(<Config />);

        expect(rendered.state('loading')).toEqual(false);
        expect(rendered.state('step')).toEqual(2);
    });

});