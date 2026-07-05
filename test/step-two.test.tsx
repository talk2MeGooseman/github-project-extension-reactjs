import { render, screen } from '@testing-library/react'
import { createStore } from 'little-state-machine'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GithubUsersRepositoriesQuery } from '../src/shared/graphql'
import { StepTwo } from '../src/views/config/form-components'
import { resetQueryResults, setQueryResult } from './urql-mock'

vi.mock('urql', async (importOriginal) => {
  const actual = await importOriginal<typeof import('urql')>()
  const { mockedUseQuery, mockedUseMutation } = await import('./urql-mock')
  return { ...actual, useQuery: mockedUseQuery, useMutation: mockedUseMutation }
})

const repo = (nameWithOwner: string) => ({
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
  createStore({ username: 'gooseman', repos: ['me/selected-repo'], fetching: false }, { persist: 'none' })
  setQueryResult(GithubUsersRepositoriesQuery, {
    fetching: false,
    data: {
      github: {
        usersRepositories: {
          totalRepositoryCount: 2,
          repositories: [repo('me/selected-repo'), repo('me/other-repo')],
        },
      },
    },
  })
})

describe('StepTwo repo selection', () => {
  it('marks already-configured repos as selected options', async () => {
    // Regression: without role="listbox" on the ActionList, Primer v38 renders
    // the multi-select checkboxes but never applies aria-selected, so saved
    // selections silently look unchecked.
    render(<StepTwo />)

    expect(
      await screen.findByRole('option', { name: /me\/selected-repo/, selected: true }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /me\/other-repo/, selected: false }),
    ).toBeInTheDocument()
  })
})
