import React, { Component } from 'react';
import GithubProjectsPanel from '../components/GithubProjectsPanel';
import { viewBroadcasterData } from "../services/Ebs";

/**
 * Viewer
 * 
 * The Entry for viewing the panel on the broadcasters channel page
 * 
 * @export
 * @class Viewer
 * @extends {Component}
 */
export default class Viewer extends Component {
    state = {
        loading: true,
        user: null,
        repos: null,
        error: false
    };

    componentDidMount() {
        // Twitch extension library
        // Listen for used auth even to get token
        window.Twitch.ext.onAuthorized( (auth) => {
            // Update state and begin rendering panel
            this.setState({
                auth
            }, () => this._getViewPanelData() );
        });
    }

    /**
     * _getViewPanelData
     * 
     * Async fetch the Github information to display for the panel.
     * 
     * @memberof Viewer
     */
    async _getViewPanelData() {
        const { auth } = this.state;

        if (!auth) {
            this.setState({
                loading: false,
                error: 'Failed to fetch information from Twitch',
            });
            return;
        }

        try {
            // Fetch panel information
            let {user, repos} = await viewBroadcasterData(auth);
            this.setState({
                loading: false,
                user,
                repos,
            });
        } catch (error) { 
            // If request fails then catch error
            this.setState({
                loading: false,
                error: 'Failed to fetch information',
            });
        } 
    }

    render() {
        let {user, repos, loading, error } = this.state;
        return(
            <GithubProjectsPanel user={user} repos={repos} loading={loading} error={error} />
        );
    }
}