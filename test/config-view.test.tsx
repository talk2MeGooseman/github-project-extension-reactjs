import { render, screen } from '@testing-library/react'
import { createStore } from 'little-state-machine'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ChannelQuery,
  GithubRepositoryQuery,
  GithubUserInfo,
  GithubUsersRepositoriesQuery,
} from '../src/shared/graphql'
import { Config } from '../src/views/config'
import { resetQueryResults, setQueryResult } from './urql-mock'

vi.mock('urql', async (importOriginal) => {
  const actual = await importOriginal<typeof import('urql')>()
  const { mockedUseQuery, mockedUseMutation } = await import('./urql-mock')
  return { ...actual, useQuery: mockedUseQuery, useMutation: mockedUseMutation }
})

const repo = (nameWithOwner: string) => ({
  name: nameWithOwner.split('/')[1],
  nameWithOwner,
  description: 'd',
  forkCount: 1,
  id: `r-${nameWithOwner}`,
  languages: [],
  stargazerCount: 1,
  url: `https://github.com/${nameWithOwner}`,
})

beforeEach(() => {
  resetQueryResults()
  createStore({ username: '', repos: [], fetching: true }, { persist: 'none' })
})

describe('Config wizard', () => {
  it('shows loading while the channel query is in flight', () => {
    setQueryResult(ChannelQuery, { fetching: true })

    render(<Config />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('surfaces channel query errors', async () => {
    setQueryResult(ChannelQuery, { fetching: false, error: { message: 'auth failed' } })

    render(<Config />)

    expect(await screen.findByText(/Error: auth failed/)).toBeInTheDocument()
  })

  it('hydrates the wizard from the channel config, dropping null repo entries', async () => {
    // repos is Maybe<Array<Maybe<String>>> in the schema — a null entry from
    // the backend must not crash the wizard or end up in the store.
    setQueryResult(ChannelQuery, {
      fetching: false,
      data: {
        channel: {
          githubProjectsConfig: {
            id: '1',
            username: 'gooseman',
            repos: ['me/repo-a', null],
          },
          channelId: '123',
        },
      },
    })
    setQueryResult(GithubUsersRepositoriesQuery, {
      fetching: false,
      data: {
        github: {
          usersRepositories: {
            totalRepositoryCount: 2,
            repositories: [repo('me/repo-a'), repo('me/repo-b')],
          },
        },
      },
    })
    setQueryResult(GithubUserInfo, {
      fetching: false,
      data: {
        github: {
          user: { avatarUrl: 'https://example.com/a.png', url: 'https://github.com/gooseman', login: 'gooseman' },
        },
      },
    })
    setQueryResult(GithubRepositoryQuery, {
      fetching: false,
      data: { github: { repository: repo('me/repo-a') } },
    })

    render(<Config />)

    // All three wizard steps render.
    expect(await screen.findByRole('button', { name: 'Set Username' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Set Repos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save and Display' })).toBeInTheDocument()

    // The username input is hydrated and the null repo entry was dropped:
    // only me/repo-a is selected in step two.
    expect(screen.getByRole('textbox')).toHaveValue('gooseman')
    expect(
      await screen.findByRole('option', { name: /me\/repo-a/, selected: true }),
    ).toBeInTheDocument()
  })
})
