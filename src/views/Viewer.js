import React, { Component } from 'react';
import styled from "styled-components";
import axios from "axios";
import GithubProjectsPanel from '../components/GithubProjectsPanel';

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
            let response = await axios({
                method: 'GET',
                url: 'https://localhost:3001/projects-twitch-extension/us-central1/viewBroadcasterData',
                headers: {
                    'x-extension-jwt': auth.token,
                }
            });
            
            this.setState({
                loading: false,
                ...response.data
            });

        } catch (error) {
            console.log(error); 
        }        
    }



    render() {
        let {user, repos, loading } = this.state;
        return(
            <GithubProjectsPanel user={user} repos={repos} loading={loading} />
        );
    }
}