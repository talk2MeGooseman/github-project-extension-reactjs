import { GithubRepo } from "../global";

export const getUserRepos = async (username: string): Promise<GithubRepo[]> => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return await response.json();
};

const getRepo = async (username: string, repoName: string): Promise<GithubRepo> => {
  const response = await fetch(
    `https://api.github.com/repos/${username}/${repoName}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return await response.json();
}

export const getRepos = async (username: string, repoNames: string[]): Promise<GithubRepo[]> => {
  const repos = await Promise.all(
    repoNames.map((repoName) => getRepo(username, repoName))
  );

  return repos;
};
