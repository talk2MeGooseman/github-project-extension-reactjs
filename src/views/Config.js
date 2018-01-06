import React, { Component } from 'react';
import axios from 'axios';
import styled from "styled-components";

import ConfigForm from "../components/ConfigForm";
import Loader from '../components/Loader';
import EditForm from '../components/EditForm';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
`

const ConfigContainer = styled.div`
    width: 70vw;
    height: 100vh;
`

const LiveContainer = styled.div`
    width: 30vw;
    height: 100vh;
`
const FormContainer = styled.div`
    width: 80%;
    height: 80%;
    overflow: auto;
`
export default class Config extends Component {
    state = {
        auth: {},
        loading: true
    };

    componentDidMount() {
        window.Twitch.ext.onAuthorized( (auth) => {
            console.log(auth);
            this.setState({
                auth
            }, () => this.getBroadcastconfig() );
        });
    }

    async getBroadcastconfig() {
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
            });
        } catch(error) {
            this.setState({
                loading: false,
            });
        }
    }

    onSubmitInfo(data) {
        const { auth } = this.state;
        axios({
            method: 'POST',
            url: 'https://localhost:3001/projects-twitch-extension/us-central1/setBroadcasterGithubInfo',
            data: {
                data,
                auth
            },
            headers: {
                'x-extension-jwt': auth.token,
            }
        }).then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async onSubmitEditInfo(data) {
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

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
               
    }

    display() {
        if (this.state.loading) {
            return(
                <div className="mui--text-center">
                    <Loader />
                    <h1>Loading...</h1>
                </div>
            );
        } else {
            if (this.state.user) {
                return(
                    <EditForm onSubmit={(data) =>  this.onSubmitEditInfo(data) } user={this.state.user} repos={this.state.repos} />
                );
            } else {
                return (
                    <ConfigForm onSubmitInfo={(data) => this.onSubmitInfo(data)} />
                );
            }
        }        
    }

    render() {
        return(
            <Container>
                <ConfigContainer>
                    <FormContainer className="mui-panel">
                        <h1>Github Projects Configuration</h1>
                        {this.display()}
                    </FormContainer>
                </ConfigContainer>
                <LiveContainer>
                    <div className="mui-panel">
                        Live Preview Will Go here Later
                    </div>
                </LiveContainer>               
            </Container>
        );
    }
}