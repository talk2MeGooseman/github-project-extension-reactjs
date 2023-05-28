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
