import { vi } from 'vitest'

/**
 * Per-query result registry for mocking urql's useQuery.
 *
 * Test files mock the 'urql' module and route useQuery through mockedUseQuery;
 * individual tests register results keyed by the imported query document, e.g.
 * setQueryResult(ChannelQuery, { fetching: false, data: {...} }).
 */
type QueryResult = {
  data?: unknown
  fetching: boolean
  error?: { message: string }
}

const results = new Map<unknown, QueryResult>()

export const setQueryResult = (query: unknown, result: QueryResult) => {
  results.set(query, result)
}

/** Shared spy for the execute function returned by useMutation. */
export const mutationSpy = vi.fn(async () => ({ data: {} }))

export const resetQueryResults = () => {
  results.clear()
  mutationSpy.mockClear()
}

export const mockedUseQuery = ({ query }: { query: unknown }) => {
  const result = results.get(query) ?? { fetching: true }
  return [{ ...result }, vi.fn()] as const
}

export const mockedUseMutation = () => [{}, mutationSpy] as const
