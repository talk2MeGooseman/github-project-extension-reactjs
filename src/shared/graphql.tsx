import { gql } from "urql";
import { GithubRepositoryArgs, GithubUsersRepositoriesArgs, RootMutationType, RootMutationTypeUpsertGithubProjectsConfigArgs, RootQueryType } from "../gql";

export const ChannelQuery = gql<RootQueryType>`
  query ChannelQuery {
    channel {
      githubProjectsConfig {
        id
        repos
        username
      }
      channelId
    }
  }
`;

export const UpsertGithubProjectsConfigMutation = gql<RootMutationType, RootMutationTypeUpsertGithubProjectsConfigArgs>`
  mutation UpsertGithubProjectsConfigMutation($username: String!, $repos: [String!]!) {
    upsertGithubProjectsConfig(username: $username, repos: $repos) {
      id
      repos
      username
    }
  }
`

export const GithubUsersRepositoriesQuery = gql<RootQueryType, GithubUsersRepositoriesArgs>`
  query GithubUsersRepositoriesQuery($username: String!) {
    github {
      usersRepositories(username: $username) {
        totalRepositoryCount
        repositories {
          nameWithOwner
          description
          forkCount
          id
          languages {
            color
            id
            name
          }
          stargazerCount
          url
        }
      }
    }
  }
`

export const GithubRepositoryQuery = gql<Pick<RootQueryType, 'github'>, GithubRepositoryArgs>`
  query GithubRepository($name: String!, $owner: String!) {
    github {
      repository(name: $name, owner: $owner) {
        name
        nameWithOwner
        description
        forkCount
        id
        languages {
          color
          id
          name
        }
        stargazerCount
        url
      }
    }
  }
`
