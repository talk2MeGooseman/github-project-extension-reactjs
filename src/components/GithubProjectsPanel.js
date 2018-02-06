import React from 'react';
import styled from "styled-components";
import Loader from "../components/Loader";
import ProjectListItem from '../components/ProjectListItem';

const Container = styled.div`
    width: 100%;
    height: 500px;
    overflow-x: hidden; 
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    font-family: Helvetica Neue, Helvetica;
    background-color: #FFFFFF;
`;

const HeroProjectContainer = styled.div`
    display: flex;
    margin-top: 10px;
    margin-left: 10px;
    min-height: 35px;
`;

const ProjectList = styled.div`
    margin: 0px;
    padding-left: 0px;
    overflow-y: scroll;
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const UsernameText = H3.extend`
    padding-top: 10px;
    padding-left: 10px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const _projectRows = (repos) => {
    if (!repos || !repos.length) {
        return <div className="mui--text-center mui--text-headline">No Github Projects Selected</div>;
    }

    let rows = repos.map((repo) => {
        return (
            <ProjectListItem onClick={() => window.open(repo.html_url, '_blank')} repo={repo} />
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
            <UsernameText onClick={ () => window.open(`https://github.com/${user.github_user.login}`) }>{user.github_user.login}</UsernameText>
        </HeroProjectContainer>
    );
}

const _titleBar = () => {
    return(
        <div className="mui-appbar mui--z2">
            <table width="100%">
                <tr style={{ verticalAlign: 'middle' }}>
                    <td class="mui--appbar-height mui--text-headline" align="center">
                        Github Projects
                    </td>
                </tr>
            </table>
        </div>
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
                {_titleBar()}
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