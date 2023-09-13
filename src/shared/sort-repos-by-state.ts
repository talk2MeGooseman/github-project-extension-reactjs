import { GithubRepository } from "../gql";

export const sortReposByState = (repos: GithubRepository[] = [], desiredOrder: string[]) =>
  repos.sort((a, b) => desiredOrder.indexOf(a.nameWithOwner) - desiredOrder.indexOf(b.nameWithOwner));
