import { ActionList } from '@primer/react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ListItem } from '../src/shared/list-item'
import { GithubRepositoryQuery } from '../src/shared/graphql'
import { resetQueryResults, setQueryResult } from './urql-mock'

vi.mock('urql', async (importOriginal) => {
  const actual = await importOriginal<typeof import('urql')>()
  const { mockedUseQuery, mockedUseMutation } = await import('./urql-mock')
  return { ...actual, useQuery: mockedUseQuery, useMutation: mockedUseMutation }
})

beforeEach(() => {
  resetQueryResults()
})

const repository = {
  name: 'repo-a',
  nameWithOwner: 'me/repo-a',
  description: 'a fine repo',
  forkCount: 1,
  id: 'r1',
  languages: [{ color: '#333', id: 'l1', name: 'Elixir' }],
  stargazerCount: 7,
  url: 'https://github.com/me/repo-a',
}

const renderItem = (sortingDisabled: boolean) =>
  render(
    <ActionList>
      <ListItem sortingDisabled={sortingDisabled} name="repo-a" owner="me" chosen={false} />
    </ActionList>,
  )

describe('ListItem', () => {
  it('shows loading while the repository query is in flight', () => {
    setQueryResult(GithubRepositoryQuery, { fetching: true })

    renderItem(true)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders a link with the repository url in viewer mode', () => {
    setQueryResult(GithubRepositoryQuery, { fetching: false, data: { github: { repository } } })

    renderItem(true)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://github.com/me/repo-a')
    expect(screen.getByText('a fine repo')).toBeInTheDocument()
  })

  it('falls back to a non-link item with the repo name when the lookup fails', () => {
    // Regression: an errored GithubRepository query used to render a permanent
    // "Loading..." row; after that fix it briefly rendered an <a> with no href.
    setQueryResult(GithubRepositoryQuery, { fetching: false, error: { message: 'not found' } })

    renderItem(true)

    expect(screen.getByText('repo-a')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders a non-link item in sorting (config) mode', () => {
    setQueryResult(GithubRepositoryQuery, { fetching: false, data: { github: { repository } } })

    renderItem(false)

    expect(screen.getByText('repo-a')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
