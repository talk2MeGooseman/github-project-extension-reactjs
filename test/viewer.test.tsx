import { render, screen } from '@testing-library/react'
import { createStore } from 'little-state-machine'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ChannelQuery, GithubRepositoryQuery, GithubUserInfo } from '../src/shared/graphql'
import { Viewer } from '../src/views/viewer'
import { resetQueryResults, setQueryResult } from './urql-mock'

vi.mock('urql', async (importOriginal) => {
  const actual = await importOriginal<typeof import('urql')>()
  const { mockedUseQuery, mockedUseMutation } = await import('./urql-mock')
  return { ...actual, useQuery: mockedUseQuery, useMutation: mockedUseMutation }
})

beforeEach(() => {
  resetQueryResults()
  createStore({ username: '', repos: [], fetching: true }, { persist: 'none' })
})

describe('Viewer', () => {
  it('tells the viewer when the channel has no config instead of loading forever', async () => {
    // Regression: an unconfigured channel (githubProjectsConfig: null) used to
    // leave state.fetching true and spin on "Loading..." indefinitely.
    setQueryResult(ChannelQuery, {
      fetching: false,
      data: { channel: { githubProjectsConfig: null, channelId: '123' } },
    })

    render(<Viewer />)

    expect(
      await screen.findByText(/hasn't configured any repositories/i),
    ).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('surfaces a channel query error instead of loading forever', async () => {
    setQueryResult(ChannelQuery, {
      fetching: false,
      error: { message: 'boom' },
    })

    render(<Viewer />)

    expect(await screen.findByText(/Error: boom/)).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('renders the configured repos for a configured channel', async () => {
    setQueryResult(ChannelQuery, {
      fetching: false,
      data: {
        channel: {
          githubProjectsConfig: { id: '1', username: 'gooseman', repos: ['me/repo-a'] },
          channelId: '123',
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
      data: {
        github: {
          repository: {
            name: 'repo-a',
            nameWithOwner: 'me/repo-a',
            description: 'a fine repo',
            forkCount: 1,
            id: 'r1',
            languages: [{ color: '#333', id: 'l1', name: 'Elixir' }],
            stargazerCount: 7,
            url: 'https://github.com/me/repo-a',
          },
        },
      },
    })

    render(<Viewer />)

    expect(await screen.findByText('repo-a')).toBeInTheDocument()
    expect(screen.getByText('a fine repo')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })
})
