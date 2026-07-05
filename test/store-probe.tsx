import { useStateMachine } from 'little-state-machine'

import { updateAction } from '../src/state/update-action'

/**
 * Renders the little-state-machine store as JSON so tests can assert on the
 * store contents after user interactions (data-testid="store-state").
 */
export const StoreProbe = () => {
  const { state } = useStateMachine({ actions: { updateAction } })
  return <pre data-testid="store-state">{JSON.stringify(state)}</pre>
}

export const readStore = (element: HTMLElement) =>
  JSON.parse(element.textContent ?? '{}') as {
    username: string
    repos: string[]
    fetching: boolean
  }
