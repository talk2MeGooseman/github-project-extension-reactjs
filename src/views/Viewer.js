import React, { Component } from 'react';
import styled from "styled-components";

import MockData from "../mock-response.json";

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    overflow-x: hidden; 
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    font-family: Helvetica Neue, Helvetica;
    background-color: #FFFFFF;
`;

const HeroProjectContainer = styled.div`
    flex: 1;
    display: flex;
    margin-left: 10px;
`;

const ProjectList = styled.ul`
    list-style-type: none;
    margin: 0px;
    padding-left: 0px;
    flex: 9;
    display: flex;
    flex-direction: column;
`;

const ProjectListItem = styled.li`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: #CCC;
    background-color: #F0F0F0;
    transition: background-color 1s ease;
    
    &:first-child {
        border-top-width: 0px;
        background-color: #FFFFFF;
    }

    &:hover {
        background-color: #BBDEFB;
    }
`;

const ProfileImageContainer = styled.span`
    border-width: 1px 1px 1px 1px;
    border-style: solid;
    border-color: black;
    height: 30px;
    width: 30px;
    display: inline-block;
    text-align: right
    margin: 0px 10px 10px 10px;
`;

const H3 = styled.div`
    color: #0366d6;
    font-size: 18px;
    font-weight: bold;
    flex: 1;
`
const UsernameText = H3.extend`
    padding-top: 10px;
    padding-left: 10px;
`

const Subtext = styled.div`
    font-size: 12px;
    font-style: italic;
    color: #5a5a5a;
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`
const Text = styled.div`
    font-size: 12px;
    flex: 1;
`

const LanguageText = styled.div`
    padding-top: 5px;
    font-size: 10px;
    flex: 1;
`

export default class Viewer extends Component {
    state = {};

    componentDidMount() {
        this.setState(MockData);
    }

    _projectRows() {
        let {repos} = this.state;
        if (!repos) {
            return 'No repos added in';
        }

        let rows = repos.map((repo) => {
            return(
                <ProjectListItem onClick={ () => window.open(repo.html_url,'_blank') }>
                    <H3>{repo.name}</H3>
                    <Text>{repo.full_name}</Text>
                    <Subtext>{repo.description}</Subtext>
                    <LanguageText>{repo.language}</LanguageText>
                </ProjectListItem>
            );
        })


        return rows;
    }

    _heroSection() {
        let { user } = this.state;
        if (!user) {
            return null;
        }

        return (
            <HeroProjectContainer>
                <ProfileImageContainer>
                    <img src={`${user.avatar_url}&s=30`} alt="avatar"/>
                </ProfileImageContainer>
                <UsernameText>{user.login}</UsernameText>
            </HeroProjectContainer>
        );
    }

    render() {
        return(
            <Container>
                {this._heroSection()}
                <ProjectList>
                    {this._projectRows()}
                </ProjectList>
            </Container>
        );
    }
}