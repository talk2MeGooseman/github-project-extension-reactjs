import React, { Component } from 'react';
import styled from "styled-components";

import GithubProjectsPanel from "../components/GithubProjectsPanel";
import Step1Form from "../components/Step1Form";
import Loader from '../components/Loader';
import Step2Form from '../components/Step2Form';
import Step3Form from '../components/Step3Form';
import { getBroadcasterGithubInfo, setBroadcasterGithubInfo, setUserSelectedRepos, selectedReposOrder } from "../services/Ebs";

const STEP_1 = 1;
const STEP_2 = 2;
const STEP_3 = 3;
const STEP_ERROR = 1000;

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

const HeaderTable = styled.table`
    width: 100%;

    td:first-child, td:last-child {
        cursor: pointer;
        width: 10%;
    }
`;

const PreviewHeader = styled.div`
    margin-bottom: 5px;
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
        
        if(!auth) {
            this.setState({
                loading: false,
                error: true,
            });
            return;
        }

        try {
            let user = await getBroadcasterGithubInfo(auth);

            let step;
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
        } catch(error) {
            console.log(error);
            let step = STEP_1;

            if(!error) {
                step = STEP_ERROR;
            } 

            this.setState({
                loading: false,
                step
            });
        }
    }

    async _onStep1Submit(data) {
        const { auth } = this.state;
        this._displaySavingOverylay();

        try {
            let user = await setBroadcasterGithubInfo(data, auth);;
            
            this.setState({
                user,
                loading: false,
                step: STEP_2,
                error: false,
            });
        } catch(error) {
            console.log(error);
            this.setState({
                error: true,
                message: error,
            });
        };

        this._hideOverlay();
    }

    async _onStep2Submit(data) {
        const { auth } = this.state;
        let responseOk = true;

        this._displaySavingOverylay();

        try {
            let user = await setUserSelectedRepos(data, auth);

            this.setState({
                user: user,
                step: STEP_3, 
                error: false,
            });
        } catch (error) {
            console.log(error);
            responseOk = false;
            this.setState({
                error: true,
            });
        }
       
        this._hideOverlay();
        return responseOk;
    }

    async _onStep3Submit(selected_repos) {
        const { auth } = this.state;
        let responseOk = true;
        this._displaySavingOverylay();

        try {
            await selectedReposOrder(selected_repos, auth);
            const cUser = Object.assign({}, this.state.user, { selected_repos })

            this.setState({
                user: cUser,
                error: false,
            });
        } catch (error) {
            console.log(error);
            responseOk = false;
            this.setState({
                error: true,
            });
        }

        this._hideOverlay();
        return responseOk;
    }

    _displaySavingOverylay() {
        // initialize modal element
        var modalEl = document.createElement('div');
        modalEl.innerHTML = '<div style="padding-top: 25%;height: 100%;" class="mui--align-middle mui--text-center"><h1>saving...</h1></div>';
        modalEl.style.width = '400px';
        modalEl.style.height = '300px';
        modalEl.style.margin = '100px auto';
        modalEl.style.backgroundColor = '#fff';

        // show modal
        window.mui.overlay('on', {
            static: true
        }, modalEl);
    }

    _hideOverlay() {
        window.mui.overlay('off');
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

            if (this.state.user.selected_repos && this.state.user.selected_repos.length > 0) {
                rightNavButton = <td className="mui--appbar-height mui--text-center mui--divider-left" onClick={this._goStep3}><div class="mui--text-button">Step 3</div></td>
            }

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

    scrollConfigContinerUp() {
        const element = document.getElementById('config-container');
        // Scroll to top between views
        if (element) {
            element.scrollTo(0, 0);
        }
    }

    displayForm() {
        let {step, loading, user } = this.state;
        this.scrollConfigContinerUp();

        if (loading) {
            return this._displayLoading();
        } else {
            if (step === STEP_2) {
                return(
                    <Step2Form onSubmit={(data) =>  this._onStep2Submit(data) } user={this.state.user} repos={this.state.repos} />
                );
            } else if (step === STEP_3) {
                return (
                    <Step3Form onSubmit={this._onStep3Submit} user={user} />
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
        let { user } = this.state;

        if(!user || !user.repos || !user.selected_repos) return [];

        return user.selected_repos.map((repo_id) => {
            return user.repos.find( repo => ( repo.id === repo_id ));
        });
    }

    render() {
        let { user, loading, error } = this.state;
        let previewRepos = this._getPreviewRepos();

        return(
            <Container>
                <ConfigContainer id="config-container">
                    {this._appBar()}
                    <FormContainer>
                        {this.displayForm()}
                    </FormContainer>
                    {error ? <div className="mui--bg-danger">Opps, something went wrong. Please try again.</div>: ''}
                </ConfigContainer>
                <LiveContainer className="mui--z5">
                    <GithubProjectsPanel user={user} loading={loading} repos={previewRepos} />
                </LiveContainer>               
            </Container>
        );
    }
}

export default Config;