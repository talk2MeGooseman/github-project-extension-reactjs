import { render, screen } from '@testing-library/react'
import { useQuery } from 'urql'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AuthWrapper from '../src/shared/auth-wrapper'
import { ChannelQuery } from '../src/shared/graphql'
import type { TwitchAuth } from '../src/global'

const Probe = () => {
  const [{ fetching }] = useQuery({ query: ChannelQuery })
  return <div>{fetching ? 'probe-fetching' : 'probe-done'}</div>
}

const fetchMock = vi.fn(
  async () =>
    new Response(JSON.stringify({ data: { channel: null } }), {
      headers: { 'content-type': 'application/json' },
    }),
)

beforeEach(() => {
  fetchMock.mockClear()
  vi.stubGlobal('fetch', fetchMock)
  vi.stubGlobal('Twitch', undefined)
  window.Twitch = {
    ext: {
      onAuthorized: (cb: (auth: TwitchAuth) => void) =>
        cb({ token: 'signed-jwt', channelId: '123', clientId: 'c', helixToken: 'h', userId: 'u' }),
    },
  }
})

describe('AuthWrapper GraphQL client', () => {
  it('sends queries as POST with the Twitch JWT header', async () => {
    // Regression: urql v5 defaults queries to GET requests, but the Phoenix
    // backend serves POST /api — the client must pin preferGetMethod: false.
    render(
      <AuthWrapper>
        <Probe />
      </AuthWrapper>,
    )

    expect(await screen.findByText('probe-done')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalled()

    const [url, init] = fetchMock.mock.calls[0] as unknown as [RequestInfo, RequestInit]
    expect(init.method).toBe('POST')
    expect(String(url)).toBe('https://guzman.codes/api')
    expect(String(url)).not.toContain('?query=')

    const headers = new Headers(init.headers)
    expect(headers.get('x-extension-jwt')).toBe('signed-jwt')
  })
})
