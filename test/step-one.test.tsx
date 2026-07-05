import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createStore } from 'little-state-machine'
import { beforeEach, describe, expect, it } from 'vitest'

import { StepOne } from '../src/views/config/form-components'
import { readStore, StoreProbe } from './store-probe'

beforeEach(() => {
  createStore(
    { username: 'existing-user', repos: ['me/repo-a'], fetching: false },
    { persist: 'none' },
  )
})

const renderStepOne = () =>
  render(
    <>
      <StepOne />
      <StoreProbe />
    </>,
  )

describe('StepOne username form', () => {
  it('prefills the input with the stored username and disables submit until edited', () => {
    renderStepOne()

    expect(screen.getByRole('textbox')).toHaveValue('existing-user')
    expect(screen.getByRole('button', { name: 'Set Username' })).toBeDisabled()
  })

  it('saves the new username and clears the repo selection on submit', async () => {
    // Changing the username invalidates the previous repo selection — the
    // store must reset repos, otherwise stale repos from another user linger.
    renderStepOne()

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new-user' } })
    const submit = screen.getByRole('button', { name: 'Set Username' })
    await waitFor(() => expect(submit).toBeEnabled())
    fireEvent.click(submit)

    await waitFor(() => {
      const store = readStore(screen.getByTestId('store-state'))
      expect(store.username).toBe('new-user')
      expect(store.repos).toEqual([])
    })
  })

  it('does not update the store when the username is emptied (required)', async () => {
    renderStepOne()

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } })
    const submit = screen.getByRole('button', { name: 'Set Username' })
    await waitFor(() => expect(submit).toBeEnabled())
    fireEvent.click(submit)

    await waitFor(() => {
      const store = readStore(screen.getByTestId('store-state'))
      expect(store.username).toBe('existing-user')
      expect(store.repos).toEqual(['me/repo-a'])
    })
  })
})
