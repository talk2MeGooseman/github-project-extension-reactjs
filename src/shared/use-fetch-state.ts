import { useStateMachine } from 'little-state-machine'
import { useEffect } from 'react'
import { useQuery } from 'urql'

import { updateAction } from '../state/update-action'
import { ChannelQuery } from './graphql'

export const useFetchUpdateState = () => {
  const { actions, state } = useStateMachine({ actions: { updateAction } })
  const [{ data, error, fetching }] = useQuery({
    query: ChannelQuery,
  })

  const username = data?.channel?.githubProjectsConfig?.username
  const repos = data?.channel?.githubProjectsConfig?.repos

  useEffect(() => {
    if (fetching) {
      return
    }

    // Clear the loading state even when the channel has no config yet,
    // so unconfigured channels don't spin on "Loading..." forever.
    actions.updateAction({
      username: username ?? '',
      repos: (repos ?? []).filter((repo) => repo != null),
      fetching: false,
    })
  }, [actions, fetching, repos, username])

  return { error, fetching, state }
}
