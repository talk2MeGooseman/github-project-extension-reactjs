import axios from "axios";
import { VERSION } from '../constants/version';

const EBS_ROOT_URL = 'https://twitch-github-projects.azurewebsites.net/api';
// const EBS_ROOT_URL = 'http://localhost:7071/api';

/**
 * getBoardcasterGithubInfo
 *
 * Fetch user Github panel configuration
 *
 * @param {Object} auth
 */
export const getBroadcasterGithubInfo = async (auth) => {
    let response = await axios({
        method: 'GET',
        url: `${EBS_ROOT_URL}/BroadcasterConfiguration`,
        headers: {
            'x-extension-jwt': auth.token,
        }
    });

    return response.data;
};

/**
 * setBroadcasterGithubInfo
 *
 * Set the users Github login information and fetch it
 *
 * @param {Object} data - github user login info
 * @param {auth} auth
 */
export const setBroadcasterGithubInfo = async (data, auth) => {
    let response = await axios({
        method: 'POST',
        url: `${EBS_ROOT_URL}/CreateBroadcasterConfiguration`,
        data: {
            data
        },
        headers: {
            'x-extension-jwt': auth.token,
        }
    });

    return response.data;
};

/**
 * setUserSelectedRepos
 *
 * Set the repositories the user has selected for display
 *
 * @param {Object} data
 * @param {Object} auth
 */
export const setUserSelectedRepos = async (data, auth) => {
    let response = await axios({
        method: 'POST',
        url: `${EBS_ROOT_URL}/BroadcasterSelectedRepositories`,
        data: {
            data
        },
        headers: {
            'x-extension-jwt': auth.token,
            'version': VERSION
        }
    });

    return response.data;
};

/**
 * selectedReposOrder
 *
 * Set the order in which the user would like to
 * display their repositories
 *
 * @param {Array} selected_repos
 * @param {Object} auth
 */
export const selectedReposOrder= async (selected_repos, auth) => {
    return await setUserSelectedRepos(selected_repos, auth);
};

/**
 * viewBroadcasterData
 *
 * Fetch Github information for display in the panel
 *
 * @param {Object} auth - Twitch auth object
 * @returns {Object} Object with user and repos attributes
 */
export const viewBroadcasterData = async (auth) => {
    let response = await axios({
        method: 'GET',
        url: `${EBS_ROOT_URL}/fetchChannel`,
        headers: {
            'x-extension-jwt': auth.token,
        }
    });

    return response.data;
};

/**
 * refreshUserRepos
 *
 * Request to update cached users repositories
 *
 * @param {Object} auth
 */
export const refreshUserRepos = async (auth) => {
    let response = await axios({
        method: 'GET',
        url: `${EBS_ROOT_URL}/RefreshBroadcasterConfiguration`,
        headers: {
            'x-extension-jwt': auth.token,
        }
    });

    return response.data;
};
