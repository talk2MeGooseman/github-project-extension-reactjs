import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Github = {
  __typename?: 'Github';
  /** Get a list of user's pinned items */
  usersPinnedItems?: Maybe<Array<Maybe<GithubPinnedItem>>>;
  /** Get a list of user's repositories */
  usersRepositories?: Maybe<GithubUserRepositories>;
  user: GithubUser;
  repository: GithubRepository
};


export type GithubUser = {
  avatar_url: Scalars['String']['output']
  login: Scalars['String']['output']
  name: Scalars['String']['output']
  pronouns: Scalars['String']['output']
  url: Scalars['String']['output']
}

export type GithubUsersPinnedItemsArgs = {
  username: Scalars['String']['input'];
};

export type GithubUsersRepositoriesArgs = {
  username: Scalars['String']['input'];
};

export type GithubRepositoryArgs = {
  name: Scalars['String']['input'];
  owner: Scalars['String']['input'];
}

export type GithubFile = {
  __typename?: 'GithubFile';
  language?: Maybe<GithubLanguage>;
  name?: Maybe<Scalars['String']['output']>;
};

export type GithubGist = {
  __typename?: 'GithubGist';
  description?: Maybe<Scalars['String']['output']>;
  files?: Maybe<Array<Maybe<GithubFile>>>;
  forkCount?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  stargazerCount?: Maybe<Scalars['Int']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type GithubLanguage = {
  __typename?: 'GithubLanguage';
  color?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** A search result */
export type GithubPinnedItem = GithubGist | GithubRepository;

export type GithubProjectsConfig = {
  __typename?: 'GithubProjectsConfig';
  id?: Maybe<Scalars['ID']['output']>;
  /** List of selected repositories by name that user wants to display */
  repos?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Github username */
  username?: Maybe<Scalars['String']['output']>;
};

export type GithubRepository = {
  __typename?: 'GithubRepository';
  description?: Maybe<Scalars['String']['output']>;
  forkCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  languages: Array<Maybe<GithubLanguage>>;
  name: Scalars['String']['output'];
  openGraphImageUrl: Maybe<Scalars['String']['output']>;
  stargazerCount: Scalars['Int']['output'];
  url: Scalars['String']['output'];
  nameWithOwner: Scalars['String']['output'];
};

export type GithubUserRepositories = {
  __typename?: 'GithubUserRepositories';
  repositories?: Maybe<Array<Maybe<GithubRepository>>>;
  totalRepositoryCount?: Maybe<Scalars['Int']['output']>;
};

export type RootMutationType = {
  __typename?: 'RootMutationType';
  /** Upsert github projects entry for a channel broadcaster */
  upsertGithubProjectsConfig?: Maybe<GithubProjectsConfig>;
};


export type RootMutationTypeUpsertGithubProjectsConfigArgs = {
  repos: Array<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  channel?: Maybe<TwitchChannel>;
  github?: Maybe<Github>;
};

export type TwitchChannel = {
  __typename?: 'TwitchChannel';
  channelId?: Maybe<Scalars['String']['output']>;
  githubProjectsConfig?: Maybe<GithubProjectsConfig>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type User = {
  __typename?: 'User';
  broadcasterType?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  offlineImageUrl?: Maybe<Scalars['String']['output']>;
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  views?: Maybe<Scalars['Int']['output']>;
};
