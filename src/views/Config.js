import React, { Component } from 'react';
import axios from 'axios';
import styled from "styled-components";

import ConfigForm from "../components/ConfigForm";

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
`
export default class Config extends Component {
    state = {
        auth: {}        
    };

    componentDidMount() {
        window.Twitch.ext.onAuthorized( (auth) => {
            console.log(auth);
            this.setState({
                auth
            });
        });
    }

    onSubmitInfo(data) {
        const { auth } = this.state;
        debugger;
        axios.post('https://us-east1-projects-twitch-extension.cloudfunction.net/broadcastSaveData', {
            data,
            auth
        }).then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    render() {
        return(
            <Container>
                <ConfigContainer>
                    <FormContainer className="mui-panel">
                        <h1>Github Projects Configuration</h1>
                        <ConfigForm onSubmitInfo={ (data) => this.onSubmitInfo(data) } />
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