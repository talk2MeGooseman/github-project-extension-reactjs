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
    if (!username || !repos || fetching) {
      return
    }

    actions.updateAction({
      username,
      repos: repos.filter((repo) => repo != null),
      fetching: false,
    })
  }, [actions, fetching, repos, username])

  return { error, fetching, state }
}
