import React, { Component } from 'react';
import axios from 'axios';
import styled from "styled-components";

import GithubProjectsPanel from "../components/GithubProjectsPanel";
import Step1Form from "../components/Step1Form";
import Loader from '../components/Loader';
import Step2Form from '../components/Step2Form';
import Step3Form from '../components/Step3Form';

const STEP_1 = 1;
const STEP_2 = 2;
const STEP_3 = 3;

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
class Config extends Component {
    state = {
        auth: {},
        loading: true,
        error: false,
    };

    constructor() {
        super();        

        this._goBack = this._goBack.bind(this);
        this._goStep2 = this._goStep2.bind(this);
        this._goStep3 = this._goStep3.bind(this);
        this._onStep3Submit = this._onStep3Submit.bind(this);
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

            let step;
            if (repos && repos.length > 0) {
               step = STEP_3; 
            } else {
               step = STEP_2; 
            }

            this.setState({
                user,
                repos,
                loading: false,
                step,
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

    async _onStep3Submit(selected_repos) {
        const { auth } = this.state;

        try {
            let response = await axios({
                method: 'POST',
                url: 'https://localhost:3001/projects-twitch-extension/us-central1/selectedReposOrder',
                data: {
                    selected_repos,
                    auth
                },
                headers: {
                    'x-extension-jwt': auth.token,
                }
            });

            const cUser = Object.assign({}, this.state.user, { selected_repos })

            this.setState({
                user: cUser
            });

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

    _goStep3() {
        this.setState({
            step: STEP_3,
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
        let  title = '';
        let leftNavButton = <td className="mui--appbar-height mui--text-center" />
        let rightNavButton = <td className="mui--appbar-height mui--text-center"/>

        // Left Nav Button
        if (this.state.step === STEP_2) {
            leftNavButton = <td className="mui--appbar-height mui--text-center mui--divider-right" onClick={this._goBack}><div class="mui--text-button">Back</div></td>
            rightNavButton = <td className="mui--appbar-height mui--text-center mui--divider-left" onClick={this._goStep3}><div class="mui--text-button">Step 3</div></td>
            title = 'Select Your Repositories';
        } else if (this.state.step === STEP_3) {
            leftNavButton = <td className="mui--appbar-height mui--text-center mui--divider-right" onClick={this._goStep2}><div class="mui--text-button">Back</div></td>
            title = 'Order Your Projects';
        } else if (this.state.step === STEP_1) {
            title = 'Enter Your GitHub Username';
        }

        // Right Nav Buttons
        if(this.state.user && this.state.step === STEP_1) {
            rightNavButton = <td className="mui--appbar-height mui--text-center mui--divider-left" onClick={this._goStep2}><div class="mui--text-button">Step 2</div></td>
        }

        return(
            <div className="mui-appbar">
                <HeaderTable>
                    <tr>
                        {leftNavButton}
                        <td className="mui--appbar-height mui--text-center">
                            <div class="mui--text-headline">{title}</div>
                        </td>
                        {rightNavButton}
                    </tr>
                </HeaderTable>
            </div>
        );
    }

    displayForm() {
        let {step, loading, user, repos } = this.state;
        if (loading) {
            return this._displayLoading();
        } else {
            if (step === STEP_2) {
                return(
                    <Step2Form onSubmit={(data) =>  this._onStep2Submit(data) } user={this.state.user} repos={this.state.repos} />
                );
            } else if (step === STEP_3) {
                return (
                    <Step3Form onSubmit={this._onStep3Submit} user={user} repos={repos} />
                );
            } else if(step === STEP_1) {
                return (
                    <Step1Form onSubmit={(data) => this._onStep1Submit(data)}/>
                );
            }

            return <h1>Sorry but were having trouble getting your info :(</h1>
        }        
    }

    _getPreviewRepos(){
        let { repos, user } = this.state;

        if(!repos || !user.selected_repos) return [];

        return user.selected_repos.map((repo_id) => {
            return repos.find( repo => ( repo.id === repo_id ));
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

export default Config;