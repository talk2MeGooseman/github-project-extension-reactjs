import { createStore } from 'little-state-machine'
import { type ReactNode, useEffect, useState } from 'react'
import { cacheExchange, Client, fetchExchange, Provider } from 'urql'

import { AuthContext } from './auth-context'

type AuthState =
  | { loading: true }
  | { loading: false; channelId: string; client: Client }

createStore(
  {
    username: '',
    repos: [],
    fetching: true,
  },
  {
    persist: 'none',
  },
)

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthData] = useState<AuthState>({
    loading: true,
  })

  useEffect(() => {
    window.Twitch.ext.onAuthorized((auth) => {
      const client = new Client({
        url: 'https://guzman.codes/api',
        // urql v5 defaults queries to GET requests; the Phoenix backend serves POST /api.
        preferGetMethod: false,
        exchanges: [cacheExchange, fetchExchange],
        fetchOptions: () => {
          return {
            headers: { 'x-extension-jwt': auth.token },
          }
        },
      })

      setAuthData({
        loading: false,
        client,
        channelId: auth.channelId,
      })
    })
  }, [])

  if (authData.loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ loading: false, channelId: authData.channelId }}>
      <Provider value={authData.client}>{children}</Provider>
    </AuthContext.Provider>
  )
}

export default AuthWrapper
