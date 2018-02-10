export const getBroadcasterGithubInfo = (auth) => {
    console.log('getBroadcasterGithubInfo Stub Called');
    return jest.fn().mockResolvedValue(43);
};

export const setBroadcasterGithubInfo = async (data, auth) => {
    console.log('setBroadcasterGithubInfo Stub Called');
    return {};
};

export const setUserSelectedRepos = async (data, auth) => {
    console.log('setUserSelectedRepos Stub Called');
    return {};
};

export const selectedReposOrder = async (selected_repos, auth) => {
    console.log('selectedReposOrder Stub Called');
    return {};
};

export const viewBroadcasterData = async (auth) => {
    console.log('viewBroadcasterData Stub Called');
    return { user: { github_user: {avatar_url: '', login: ''} }, repos: [] };
};