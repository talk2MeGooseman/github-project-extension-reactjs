import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createStore } from 'little-state-machine'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GithubRepositoryQuery, GithubUserInfo } from '../src/shared/graphql'
import { StepThree } from '../src/views/config/form-components'
import { mutationSpy, resetQueryResults, setQueryResult } from './urql-mock'

vi.mock('urql', async (importOriginal) => {
  const actual = await importOriginal<typeof import('urql')>()
  const { mockedUseQuery, mockedUseMutation } = await import('./urql-mock')
  return { ...actual, useQuery: mockedUseQuery, useMutation: mockedUseMutation }
})

beforeEach(() => {
  resetQueryResults()
  createStore(
    { username: 'gooseman', repos: ['me/repo-a', 'me/repo-b'], fetching: false },
    { persist: 'none' },
  )
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
          description: 'd',
          forkCount: 1,
          id: 'r1',
          languages: [],
          stargazerCount: 1,
          url: 'https://github.com/me/repo-a',
        },
      },
    },
  })
})

describe('StepThree save and display', () => {
  it('renders the configured repos in the preview list', () => {
    render(<StepThree />)

    expect(screen.getByText('repo-a')).toBeInTheDocument()
    expect(screen.getByText('repo-b')).toBeInTheDocument()
  })

  it('saves the username and repo order through the mutation on submit', async () => {
    render(<StepThree />)

    fireEvent.click(screen.getByRole('button', { name: 'Save and Display' }))

    await waitFor(() => {
      expect(mutationSpy).toHaveBeenCalledWith({
        username: 'gooseman',
        repos: ['me/repo-a', 'me/repo-b'],
      })
    })
  })
})
