import React, { Component } from 'react';
import axios from 'axios';
import styled from "styled-components";

import GithubProjectsPanel from "../components/GithubProjectsPanel";
import Step1Form from "../components/Step1Form";
import Loader from '../components/Loader';
import Step2Form from '../components/Step2Form';

const STEP_1 = 1;
const STEP_2 = 2;

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    background-color: #17141F;

    #mui-overlay {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`

const ConfigContainer = styled.div`
    width: 70vw;
    height: 100vh;
    background-color: #ffffff;
    margin-right: 50px;
    overflow: auto;
`

const LiveContainer = styled.div`
    width: 318px;
    height: 500px;
    padding: 0;
`
const FormContainer = styled.div`
    margin: 15px;
`

const LoadingContainer = styled.div`
    height:50vh;
`;

const HeaderTable = styled.table`
    width: 100%;

    td:first-child, td:last-child {
        cursor: pointer;
        width: 10%;
    }
`;
export default class Config extends Component {
    state = {
        auth: {},
        loading: true,
        error: false,
    };

    constructor() {
        super();        

        this._goBack = this._goBack.bind(this);
        this._goStep2 = this._goStep2.bind(this);
    }

    componentDidMount() {
        window.Twitch.ext.onAuthorized( (auth) => {
            this.setState({
                auth
            }, () => this._getBroadcastconfig() );
        });
    }

    async _getBroadcastconfig() {
        const { auth } = this.state;

        try {
            let response = await axios({
                method: 'GET',
                url: 'https://localhost:3001/projects-twitch-extension/us-central1/getBroadcasterGithubInfo',
                headers: {
                    'x-extension-jwt': auth.token,
                }
            });

            let {user ,repos} = response.data;
            this.setState({
                user,
                repos,
                loading: false,
                step: STEP_2,
            });
        } catch(error) {
            this.setState({
                loading: false,
                step: STEP_1,
            });
        }
    }

    async _onStep1Submit(data) {
        const { auth } = this.state;
        try {
            let response = await axios({
                method: 'POST',
                url: 'https://localhost:3001/projects-twitch-extension/us-central1/setBroadcasterGithubInfo',
                data: {
                    data,
                    auth
                },
                headers: {
                    'x-extension-jwt': auth.token,
                }
            });

            let {user ,repos} = response.data;
            this.setState({
                user,
                repos,
                loading: false,
                step: STEP_2
            });
        } catch(error) {
            console.log(error);
            this.setState({
                error: true
            });
        };
    }

    async _onStep2Submit(data) {
        const { auth } = this.state;

        try {
            let response = await axios({
                method: 'POST',
                url: 'https://localhost:3001/projects-twitch-extension/us-central1/updateBroadcasterGithubConfigs',
                data: {
                    data,
                    auth
                },
                headers: {
                    'x-extension-jwt': auth.token,
                }
            });

            this._getBroadcastconfig();

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
               
    }

    _goBack() {
        this.setState({
            step: STEP_1,
        });
    }

    _goStep2() {
        this.setState({
            step: STEP_2,
        });
    }

    _displayLoading() {
        return(
            <LoadingContainer className="mui--text-center">
                <Loader />
                <h1>Loading...</h1>
            </LoadingContainer>
        );
    }

    _appBar() {
        let step2Button = null, step1Button = null;

        if (this.state.step === STEP_2) {
            step1Button = <td className="mui--appbar-height mui--text-center mui--divider-right" onClick={this._goBack}><div class="mui--text-button">Back</div></td>
        } else {
            step1Button = <td className="mui--appbar-height mui--text-center"/>
        }

        if(this.state.user && this.state.step === STEP_1) {
            step2Button = <td className="mui--appbar-height mui--text-center mui--divider-left" onClick={this._goStep2}><div class="mui--text-button">Step 2</div></td>
        } else {
            step2Button = <td className="mui--appbar-height mui--text-center"/>
        }

        return(
            <div className="mui-appbar">
                <HeaderTable>
                    <tr>
                        {step1Button}
                        <td className="mui--appbar-height mui--text-center"><div class="mui--text-headline">{ this.state.user ? 'Select Your Repositories' : 'Enter Your GitHub Username' }</div></td>
                        {step2Button}
                    </tr>
                </HeaderTable>
            </div>
        );
    }

    displayForm() {
        if (this.state.loading) {
            return this._displayLoading();
        } else {
            if (this.state.step === STEP_2) {
                return(
                    <Step2Form onSubmit={(data) =>  this._onStep2Submit(data) } user={this.state.user} repos={this.state.repos} />
                );
            } else {
                return (
                    <Step1Form onSubmit={(data) => this._onStep1Submit(data)} />
                );
            }
        }        
    }

    _getPreviewRepos(){
        let { repos, user } = this.state;

        if(!repos || !user.selected_repos) return [];

        return repos.filter((repo) => {
            return user.selected_repos.includes(repo.id);
        });
    }

    render() {
        let { user, loading } = this.state;
        let previewRepos = this._getPreviewRepos();

        return(
            <Container>
                <ConfigContainer>
                    {this._appBar()}
                    <FormContainer>
                        {this.displayForm()}
                    </FormContainer>
                </ConfigContainer>
                <LiveContainer className="mui-panel mui--z5">
                    <GithubProjectsPanel user={user} loading={loading} repos={previewRepos} />
                </LiveContainer>               
            </Container>
        );
    }
}