import React, { Component } from 'react';
import styled from "styled-components";

import GithubProjectsPanel from "../components/GithubProjectsPanel";
import Step1Form from "../components/Step1Form";
import Loader from '../components/Loader';
import Step2Form from '../components/Step2Form';
import Step3Form from '../components/Step3Form';
import GithubImageHeader from "../components/GithubImageHeader";
import ConfigAppBar from "../components/ConfigAppBar";
import { displaySavingOverylay, hideOverlay } from "../lib/mui-helpers";
import {
  getBroadcasterGithubInfo,
  setBroadcasterGithubInfo,
  setUserSelectedRepos,
  selectedReposOrder,
  refreshUserRepos,
} from "../services/Ebs";

/** User needs to input Github login */
const STEP_1 = 1;
/** User needs to select repositories for display */
const STEP_2 = 2;
/** User can sort their repositories */
const STEP_3 = 3;
const STEP_ERROR = 1000;

/** 
title Step 1 Form Submission

UI -> UI: Input github username
UI->Backend: Submit form username
Backend->Github: Fetch User metadata
Github->Backend: User metadata
Backend->Github: Fetch user repos
Github->Backend: Repos list

*/

/** 
title Step 2 Form

UI->Backend: Fetches Cached User info and Repos list
Backend->UI: Return user info and repos list
UI->UI: User selects repos they want to show up
UI->Backend: Submit repos selected
Backend->Backend: Persist
Backend-> UI: Send OK 
*/

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
`;

const ConfigContainer = styled.div`
    width: 70vw;
    min-width: 600px;
    height: 100vh;
    background-color: #ffffff;
    margin-right: 50px;
    overflow: auto;
`;

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

/**
 * Config
 * 
 * Config view for broadcaster to setup their panel
 * 
 * @class Config
 * @extends {Component}
 */
class Config extends Component {
    // Set inital state
    state = {
        auth: {},
        loading: true,
        error: false,
    };

    constructor() {
        super();

        this._goStep1 = this._goStep1.bind(this);
        this._goStep2 = this._goStep2.bind(this);
        this._goStep3 = this._goStep3.bind(this);
        this._onStep3Submit = this._onStep3Submit.bind(this);
    }

    componentDidMount() {
        // Get user auth information from Twitch
        window.Twitch.ext.onAuthorized( (auth) => {
            // Set auth info and then fetch broadcaster configuration
            this.setState({
                auth
            }, () => this._getBroadcastconfig() );
        });
    }

    /**
     * Fetch the broadcasters configuration information so we know what
     * step they are on
     * 
     * @memberof Config
     */
    async _getBroadcastconfig() {
        const { auth } = this.state;
        
        // Check if we have authed
        if(!auth) {
            this.setState({
                loading: false,
                error: 'Authentication with Twitch Failed',
            });
            return;
        }

        try {
            // Fetch the configuration info
            let user = await getBroadcasterGithubInfo(auth);

            let step;
            // Check if they have selected their repos yet
            if (user.selected_repos && user.selected_repos.length > 0) {
               step = STEP_3; 
            } else {
               step = STEP_2; 
            }

            this.setState({
                user,
                loading: false,
                step,
            });
        } catch(e) {
            const code = e.response.status;
            // Fetch for info failed
            let step = STEP_1;
            let error = 'Configuration Needed';

            if(code !== 404) {
                step = STEP_ERROR;
                error = "Something went wrong :(";
            } 

            this.setState({
                loading: false,
                step,
                error,
            });
        }
    }

    /**
     * _onStep1Submit
     * 
     * Send Github login name and fetch relevent information
     * 
     * @param {Object} data 
     * @memberof Config
     */
    async _onStep1Submit(data) {
        const { auth } = this.state;
        displaySavingOverylay('Fetching Information');

        try {
            let user = await setBroadcasterGithubInfo(data, auth);;
            
            this.setState({
                user,
                loading: false,
                step: STEP_2,
                error: false,
            });
        } catch(error) {
            this.setState({
                error: true,
            });
        };

        hideOverlay();
    }

    /**
     * _onStep2Submit
     * 
     * Submit and save user selected repositories
     * 
     * @param {Object} data 
     * @memberof Config
     */
    async _onStep2Submit(data) {
        const { auth } = this.state;
        let responseOk = true;

        displaySavingOverylay('Saving Repositories');

        try {
            let user = await setUserSelectedRepos(data, auth);

            this.setState({
                user: user,
                step: STEP_3, 
                error: false,
            });
        } catch (error) {
            responseOk = false;
            this.setState({
                error: true,
            });
        }
       
        hideOverlay();
        return responseOk;
    }

    /**
     * _onStep3Submit
     * 
     * Submit and save user ordering of repositories
     * 
     * @param {Array} selected_repos 
     * @memberof Config
     */
    async _onStep3Submit(selected_repos) {
        const { auth } = this.state;
        let responseOk = true;

        displaySavingOverylay('Saving Order');

        try {
            await selectedReposOrder(selected_repos, auth);
            const cUser = Object.assign({}, this.state.user, { selected_repos })

            this.setState({
                user: cUser,
                error: false,
            });
        } catch (error) {
            responseOk = false;
            this.setState({
                error: true,
            });
        }

        hideOverlay();
        return responseOk;
    }

    /**
     * _onClickRefresh
     * 
     * User clicked the refresh button
     * 
     * @memberof Config
     */
    _onClickRefresh() {
        // Set state to freshing and request update to users repos
        this.setState({
            refresh_repos: true,
        }, () => this._refreshUserRepos());
    }

    /**
     * _refreshUserRepos
     * 
     * Request EBS to refresh the cached list of user repositories
     * 
     * @memberof Config
     */
    async _refreshUserRepos() {
        try {
            const { auth } = this.state;
            const { repos } = await refreshUserRepos(auth);

            let user = Object.assign({}, this.state.user);
            user.repos = repos;

            this.setState({
                user: user,
                refresh_repos: false,
                error: false,
            });
        } catch (error) {
            this.setState({
                repos: [],
                refresh_repos: false,
                error: true,
            });
        }
    }

    _goStep1() {
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

    scrollConfigContinerUp() {
        const element = document.getElementById('config-container');
        // Scroll to top between views
        if (element) {
            element.scrollTo(0, 0);
        }
    }

    /**
     * displayForm
     * 
     * Selects the form to display based off the step user is on
     */
    displayForm() {
        let {step, loading, user, refresh_repos} = this.state;

        if (loading || refresh_repos) {
            return this._displayLoading();
        } else {
            // STEP 2
            if (step === STEP_2) {
                const props = {
                    username: user.github_user.login,
                    avatar_url: user.github_user.avatar_url,
                };
                return(
                    <div>
                        <GithubImageHeader {...props} />
                        <div className="mui--text-right">
                            <button onClick={() => { this._onClickRefresh()} } class="mui-btn mui-btn--small mui-btn--primary">Refresh Repos</button>
                        </div>
                        <Step2Form onSubmit={(data) =>  this._onStep2Submit(data) } user={this.state.user} repos={this.state.repos} />
                    </div>
                );
            // STEP 3
            } else if (step === STEP_3) {
                return (
                    <Step3Form onSubmit={this._onStep3Submit} user={user} />
                );
            // STEP 1
            } else if(step === STEP_1) {
                return (
                    <Step1Form onSubmit={(data) => this._onStep1Submit(data)}/>
                );
            }

            return <h1>Sorry but were having trouble getting your info :(</h1>
        }        
    }

    /**
     * _getSelectedRepoObjects
     * 
     * Gets the list of selected repository data
     * 
     * @returns {Array}
     * @memberof Config
     */
    _getSelectedRepoObjects(){
        let { user } = this.state;

        if(!user || !user.repos || !user.selected_repos) return [];

        return user.selected_repos.map((repo_id) => {
            return user.repos.find( repo => ( repo.id === repo_id ));
        });
    }

    render() {
        let { user, loading, error, step } = this.state;
        let previewRepos = this._getSelectedRepoObjects();

        return(
            <Container>
                <ConfigContainer id="config-container">
                    <ConfigAppBar step={step} user={user} goStep1={this._goStep1} goStep2={this._goStep2} goStep3={this._goStep3} />
                    <FormContainer>
                        {this.displayForm()}
                    </FormContainer>
                    {error ? <div className="mui--bg-danger">Opps, something went wrong. Please try again.</div>: ''}
                </ConfigContainer>
                <LiveContainer className="mui--z5">
                    <GithubProjectsPanel user={user} loading={loading} repos={previewRepos} error={error} />
                </LiveContainer>
            </Container>
        );
    }
}

export default Config;