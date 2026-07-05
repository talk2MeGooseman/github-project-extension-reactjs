import type { GlobalState } from 'little-state-machine'

export const updateAction = (state: GlobalState, payload: Partial<GlobalState>): GlobalState => {
  return {
    ...state,
    ...payload,
  }
}
