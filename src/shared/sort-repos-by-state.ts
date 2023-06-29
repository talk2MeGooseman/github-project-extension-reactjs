import { GithubRepo } from "../global";

export const sortReposByState = (repos: GithubRepo[], desiredOrder: string[]) => repos.sort((a, b) => desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name));
