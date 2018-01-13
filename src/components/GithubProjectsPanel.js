import React from 'react';
import styled from "styled-components";
import Loader from "../components/Loader";

const Container = styled.div`
    width: 100%;
    height: 100%;
    max-height: 500px;
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
const _projectRows = (repos) => {
    if (!repos || !repos.length) {
        return 'Pleae Select Your Projects';
    }

    let rows = repos.map((repo) => {
        return (
            <ProjectListItem onClick={() => window.open(repo.html_url, '_blank')}>
                <H3>{repo.name}</H3>
                <Text>{repo.full_name}</Text>
                <Subtext>{repo.description}</Subtext>
                <LanguageText>{repo.language}</LanguageText>
            </ProjectListItem>
        );
    })


    return rows;
}

const _heroSection = (user) => {
    if (!user) {
        return null;
    }

    return (
        <HeroProjectContainer>
            <ProfileImageContainer>
                <img src={`${user.github_user.avatar_url}&s=30`} alt="avatar" />
            </ProfileImageContainer>
            <UsernameText>{user.github_user.login}</UsernameText>
        </HeroProjectContainer>
    );
}

const _displayContent = (user, loading, repos) => {
    if (loading) {
        return (
            <Container>
                <Loader />
            </Container>
        );
    } else {
        return (
            <Container>
                {_heroSection(user)}
                <ProjectList>
                    {_projectRows(repos)}
                </ProjectList>
            </Container>
        );
    }
}

const GithubProjectsPanel = ({user, loading, repos}) => {
    return _displayContent(user, loading, repos);
};

export default GithubProjectsPanel;