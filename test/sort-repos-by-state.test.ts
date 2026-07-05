import { describe, expect, it } from 'vitest'

import type { GithubRepository } from '../src/gql'
import { sortReposByState } from '../src/shared/sort-repos-by-state'

const repo = (nameWithOwner: string) => ({ nameWithOwner }) as GithubRepository

describe('sortReposByState', () => {
  it('orders repos to match the saved order', () => {
    const repos = [repo('me/c'), repo('me/a'), repo('me/b')]

    const sorted = sortReposByState(repos, ['me/a', 'me/b', 'me/c'])

    expect(sorted.map((r) => r.nameWithOwner)).toEqual(['me/a', 'me/b', 'me/c'])
  })

  it('defaults to an empty list when repos are missing', () => {
    expect(sortReposByState(undefined, ['me/a'])).toEqual([])
  })

  it('places repos missing from the saved order first without crashing', () => {
    // indexOf returns -1 for unknown repos, sorting them to the front — pin
    // that behavior so a change to it is a conscious decision.
    const repos = [repo('me/known'), repo('me/unknown')]

    const sorted = sortReposByState(repos, ['me/known'])

    expect(sorted.map((r) => r.nameWithOwner)).toEqual(['me/unknown', 'me/known'])
  })
})
