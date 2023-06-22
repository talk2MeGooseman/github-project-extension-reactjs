import "little-state-machine";

declare module "little-state-machine" {
  interface GlobalState {
    username?: string;
    repos: string[];
  }
}

export type GithubRepo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

export type SortableGithubRepo = GithubRepo & { chosen: boolean };
