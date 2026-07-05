import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createStore } from 'little-state-machine'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GithubUsersRepositoriesQuery } from '../src/shared/graphql'
import { StepTwo } from '../src/views/config/form-components'
import { readStore, StoreProbe } from './store-probe'
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

  it('disables Set Repos until the selection differs from the saved config', async () => {
    render(<StepTwo />)

    const submit = screen.getByRole('button', { name: 'Set Repos' })
    await screen.findByRole('option', { name: /me\/selected-repo/, selected: true })
    expect(submit).toBeDisabled()

    fireEvent.click(screen.getByRole('option', { name: /me\/other-repo/ }))

    await waitFor(() => expect(submit).toBeEnabled())
  })

  it('toggles selection on click and stores the new selection on submit', async () => {
    render(
      <>
        <StepTwo />
        <StoreProbe />
      </>,
    )

    fireEvent.click(await screen.findByRole('option', { name: /me\/other-repo/ }))
    expect(
      await screen.findByRole('option', { name: /me\/other-repo/, selected: true }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Set Repos' }))

    await waitFor(() => {
      expect(readStore(screen.getByTestId('store-state')).repos).toEqual([
        'me/selected-repo',
        'me/other-repo',
      ])
    })
  })

  it('rejects an empty selection with a validation message instead of saving', async () => {
    render(
      <>
        <StepTwo />
        <StoreProbe />
      </>,
    )

    // Deselect the only configured repo, then try to submit.
    fireEvent.click(await screen.findByRole('option', { name: /me\/selected-repo/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Set Repos' }))

    expect(
      await screen.findByText('You must select at least one repository.'),
    ).toBeInTheDocument()
    expect(readStore(screen.getByTestId('store-state')).repos).toEqual(['me/selected-repo'])
  })

  it('tolerates null entries in the repositories list from the backend', async () => {
    // repositories is Maybe<Array<Maybe<GithubRepository>>> in the schema.
    setQueryResult(GithubUsersRepositoriesQuery, {
      fetching: false,
      data: {
        github: {
          usersRepositories: {
            totalRepositoryCount: 2,
            repositories: [repo('me/selected-repo'), null],
          },
        },
      },
    })

    render(<StepTwo />)

    expect(
      await screen.findByRole('option', { name: /me\/selected-repo/, selected: true }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })

  it('shows loading while the repositories query is in flight', () => {
    setQueryResult(GithubUsersRepositoriesQuery, { fetching: true })

    render(<StepTwo />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
