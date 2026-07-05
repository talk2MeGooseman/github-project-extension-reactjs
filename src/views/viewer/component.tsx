import { BaseStyles, ThemeProvider } from '@primer/react'
import { useStateMachine } from 'little-state-machine'

import { List } from '../../shared'
import { useFetchUpdateState } from '../../shared/use-fetch-state'
import { updateAction } from '../../state/update-action'

export const Viewer = () => {
  const { state } = useStateMachine({ actions: { updateAction } })
  const { error } = useFetchUpdateState()

  if (state.fetching) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!state.username) {
    return <div>This channel hasn't configured any repositories to display yet.</div>
  }

  return (
    <ThemeProvider colorMode="light">
      <BaseStyles>
        <List disableSorting username={state.username} repos={state.repos} />
      </BaseStyles>
    </ThemeProvider>
  )
}
