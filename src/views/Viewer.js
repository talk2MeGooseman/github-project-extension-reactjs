import React, { Component } from 'react';
import GithubProjectsPanel from '../components/GithubProjectsPanel';
import { viewBroadcasterData } from "../services/Ebs";

export default class Viewer extends Component {
    state = {
        loading: true,
    };

    componentDidMount() {
        window.Twitch.ext.onAuthorized( (auth) => {
            console.log(auth);
            this.setState({
                auth
            }, () => this._getViewPanelData() );
        });
    }

    async _getViewPanelData() {
        const { auth } = this.state;

        if (!auth) return;

        try {
            let data = await viewBroadcasterData(auth);            
            this.setState({
                loading: false,
                ...data
            });

        } catch (error) {
            this.setState({
                loading: false,
                error: true,
            });
        }        
    }



    render() {
        let {user, repos, loading } = this.state;
        return(
            <GithubProjectsPanel user={user} repos={repos} loading={loading} />
        );
    }
}