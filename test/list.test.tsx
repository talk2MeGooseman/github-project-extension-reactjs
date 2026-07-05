import { render, screen } from '@testing-library/react'
import { describe, beforeEach, expect, it, vi } from 'vitest'

import { List } from '../src/shared/list'
import { GithubRepositoryQuery, GithubUserInfo } from '../src/shared/graphql'
import { resetQueryResults, setQueryResult } from './urql-mock'

vi.mock('urql', async (importOriginal) => {
  const actual = await importOriginal<typeof import('urql')>()
  const { mockedUseQuery, mockedUseMutation } = await import('./urql-mock')
  return { ...actual, useQuery: mockedUseQuery, useMutation: mockedUseMutation }
})

const repository = {
  name: 'repo-a',
  nameWithOwner: 'me/repo-a',
  description: 'a fine repo',
  forkCount: 1,
  id: 'r1',
  languages: [],
  stargazerCount: 7,
  url: 'https://github.com/me/repo-a',
}

beforeEach(() => {
  resetQueryResults()
  setQueryResult(GithubRepositoryQuery, { fetching: false, data: { github: { repository } } })
})

describe('List header', () => {
  it('links to the GitHub user when the lookup succeeds', () => {
    setQueryResult(GithubUserInfo, {
      fetching: false,
      data: {
        github: {
          user: { avatarUrl: 'https://example.com/a.png', url: 'https://github.com/gooseman', login: 'gooseman' },
        },
      },
    })

    render(<List disableSorting username="gooseman" repos={['me/repo-a']} />)

    expect(screen.getByRole('link', { name: /gooseman/ })).toHaveAttribute(
      'href',
      'https://github.com/gooseman',
    )
  })

  it('falls back to plain username text when the user lookup fails', () => {
    // Regression: a failed GithubUserInfo query used to render a Header.Link
    // with no href and an empty avatar.
    setQueryResult(GithubUserInfo, { fetching: false, error: { message: 'nope' } })

    render(<List disableSorting username="gooseman" repos={['me/repo-a']} />)

    expect(screen.getByText('gooseman')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /gooseman/ })).not.toBeInTheDocument()
    const emptyHrefLinks = screen
      .queryAllByRole('link')
      .filter((a) => !a.getAttribute('href'))
    expect(emptyHrefLinks).toHaveLength(0)
  })
})

describe('List repos prop sync', () => {
  it('re-syncs the rendered items when the repos prop changes', () => {
    // Guards the render-time state adjustment that replaced the old
    // setState-in-effect: item state must follow the repos prop without
    // looping or going stale.
    setQueryResult(GithubUserInfo, { fetching: false, error: { message: 'nope' } })

    const { rerender } = render(<List disableSorting username="gooseman" repos={['me/repo-a']} />)
    expect(screen.getByText('repo-a')).toBeInTheDocument()

    rerender(<List disableSorting username="gooseman" repos={['me/repo-b', 'me/repo-c']} />)

    expect(screen.queryByText('repo-a')).not.toBeInTheDocument()
    expect(screen.getByText('repo-b')).toBeInTheDocument()
    expect(screen.getByText('repo-c')).toBeInTheDocument()
  })
})
