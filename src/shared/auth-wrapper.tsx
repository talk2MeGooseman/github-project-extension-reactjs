import React, { useEffect, useState } from 'react'
import { AuthContextType } from '../global'
import { AuthContext } from './auth-context';
import { Client, Provider, cacheExchange, fetchExchange } from 'urql';
import { StateMachineProvider, createStore } from 'little-state-machine';

type StateType = {
  loading: boolean,
  channelId?: string,
  client?: Client,
}

createStore({
  username: undefined,
  repos: [],
  fetching: true
},
  {
    persist: 'none'
  },
);

const AuthWrapper = ({ children, mode }) => {
  const [authData, setAuthData] = useState<StateType>({
    loading: true,
  })

  useEffect(() => {
    window.Twitch.ext.onAuthorized((auth) => {
      const client = new Client({
        url: 'https://guzman.codes/api',
        exchanges: [cacheExchange, fetchExchange],
        fetchOptions: () => {
          return {
            headers: { 'x-extension-jwt': auth.token },
          };
        },
      });

      setAuthData({
        loading: false,
        client,
        channelId: auth.channelId,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (authData.loading) {
    return <div>Loading...</div>
  }

  return (
    <StateMachineProvider>
      <AuthContext.Provider value={authData}>
        <Provider value={authData.client}>
          {children}
        </Provider>
      </AuthContext.Provider>
    </StateMachineProvider>
  )
}

export default AuthWrapper
