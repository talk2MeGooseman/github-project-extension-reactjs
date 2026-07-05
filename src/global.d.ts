import 'little-state-machine'

declare module 'little-state-machine' {
  interface GlobalState {
    username: string
    repos: string[]
    fetching: boolean
  }
}

export type GithubRepo = {
  id: number
  name: string
  description: string
  html_url: string
  created_at: string
  updated_at: string
  pushed_at: string
  language: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
}

export type SortableRepo = {
  id: string
  name: string
  chosen: boolean
  owner: string
  nameWithOwner: string
}

export type TwitchAuth = {
  channelId: string
  clientId: string
  helixToken: string
  token: string
  userId: string
}

export type AuthContextType = {
  channelId?: string
  loading: boolean
}

declare global {
  interface Window {
    Twitch: {
      ext: {
        onAuthorized(callback: (auth: TwitchAuth) => void): void
      }
    }
  }
}
