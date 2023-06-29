import { gql } from "urql";
import { RootMutationType, RootMutationTypeUpsertGithubProjectsConfigArgs, RootQueryType } from "../gql";

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
