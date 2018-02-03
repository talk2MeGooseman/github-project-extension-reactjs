import axios from "axios";

export const getBroadcasterGithubInfo = async (auth) => {
    let response = await axios({
        method: 'GET',
        url: `https://us-central1-projects-twitch-extension.cloudfunctions.net/getBroadcasterGithubInfo`,
        headers: {
            'x-extension-jwt': auth.token,
        }
    });

    return response.data;
};

export const setBroadcasterGithubInfo = async (data, auth) => {
    let response = await axios({
        method: 'POST',
        url: `https://us-central1-projects-twitch-extension.cloudfunctions.net/setBroadcasterGithubInfo`,
        data: {
            data,
            auth
        },
        headers: {
            'x-extension-jwt': auth.token,
        }
    });

    return response.data;
};

export const setUserSelectedRepos = async (data, auth) => {
    let response = await axios({
        method: 'POST',
        url: `https://us-central1-projects-twitch-extension.cloudfunctions.net/setUserSelectedRepos`,
        data: {
            data,
            auth
        },
        headers: {
            'x-extension-jwt': auth.token,
        }
    });

    return response.data;
};

export const selectedReposOrder= async (selected_repos, auth) => {
    let response = await axios({
        method: 'POST',
        url: `https://us-central1-projects-twitch-extension.cloudfunctions.net/selectedReposOrder`,
        data: {
            selected_repos,
            auth
        },
        headers: {
            'x-extension-jwt': auth.token,
        }
    });

    return response.data;
};

export const viewBroadcasterData= async (auth) => {
    let response = await axios({
        method: 'GET',
        url: 'https://us-central1-projects-twitch-extension.cloudfunctions.net/viewBroadcasterData',
        headers: {
            'x-extension-jwt': auth.token,
        }
    });

    return response.data;
};