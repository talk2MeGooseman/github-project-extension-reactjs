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

export const resetQueryResults = () => {
  results.clear()
}

export const mockedUseQuery = ({ query }: { query: unknown }) => {
  const result = results.get(query) ?? { fetching: true }
  return [{ ...result }, vi.fn()] as const
}

export const mockedUseMutation = () => [{}, vi.fn()] as const
