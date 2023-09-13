import { useStateMachine } from "little-state-machine";
import { dotPath } from "ramda-extension";
import { useEffect } from "react";
import { useQuery } from "urql";
import { updateAction } from "../state/update-action";
import { ChannelQuery } from "./graphql";

const getUsername = dotPath('channel.githubProjectsConfig.username');
const getRepos = dotPath('channel.githubProjectsConfig.repos');

export const useFetchUpdateState = () => {
  const { actions, state } = useStateMachine({ updateAction });
  const [{ data, error, fetching }] = useQuery({
    query: ChannelQuery,
  });

  const username = getUsername(data);
  const repos = getRepos(data);

  useEffect(() => {
    if (!username || !repos || fetching) {
      return;
    }

    actions.updateAction({
      username: getUsername(data),
      repos: getRepos(data),
      fetching: false,
    });
  }, [actions, data, fetching, repos, username]);

  return { error, fetching, state };
}
