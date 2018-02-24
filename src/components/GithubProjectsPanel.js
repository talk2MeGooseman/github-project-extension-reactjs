import React from 'react';
import PropTypes from 'prop-types';
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
    overflow-y: auto;
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
`;
const UsernameText = H3.extend`
    color: #2096F3;
    padding-top: 10px;
    padding-left: 10px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

/**
 * _projectRows
 * 
 * Iterates over the repos for display
 * 
 * @param {Array} repos 
 */
const _projectRows = (repos) => {
    // Check if there are any repos to display
    if (!repos || !repos.length) {
        return <div className="mui--text-center mui--text-headline">No Repositories</div>;
    }

    let rows = repos.map((repo) => {
        return (
            <ProjectListItem key={repo.id} onClick={() => window.open(repo.html_url, '_blank')} repo={repo} />
        );
    })

    return rows;
}

/**
 * _heroSection
 * 
 * Display section of Github username and avatar image
 *  
 * @param {Object} user - user github information
 */
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

/**
 * _titleBar
 * 
 * Displays title area "Github Projects"
 */
const _titleBar = () => {
    return(
        <div className="mui-appbar mui--z2" style={{ height: '56px', minHeight: '56px' }}>
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

/**
 * _displayContent
 * 
 * Handles if we should displa and loader, error message,
 * or render the full panel
 * 
 * @returns {Object} JSX
 * @param {Object} user 
 * @param {String} loading 
 * @param {Array} repos 
 * @param {String} error
 */
const _displayContent = (user, loading, repos, error) => {
    // Display loader
    if (loading) {
        return (
            <Container>
                <Loader />
            </Container>
        );
    // Display error if data is missing or error thrown
    } else if (error || !user || !user.hasOwnProperty('github_user')) {
        const message = error || "Something went wrong :(";

        return (
            <Container>
                <div className="mui--text-center mui--text-headline">{message}</div>;
            </Container>
        );
    // If not issue render component
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

/**
 * GitubProjectsPanel
 * 
 * Panel that displays a single column multi row UI
 * of the repos passed in
 * 
 * @param {Object} props
 */
const GithubProjectsPanel = ({user, loading, repos, error}) => {
    return _displayContent(user, loading, repos, error);
};

GithubProjectsPanel.propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
    repos: PropTypes.array,
    error: PropTypes.string,
}

export default GithubProjectsPanel;