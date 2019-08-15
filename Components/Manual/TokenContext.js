import React, { useContext, useEffect } from 'react'
import useLocalStorage from './LocalStorage'

// Name of local storage key
const AUTH_TOKEN = 'auth_token'

const TokenContext = React.createContext()

const TokenConsumer = TokenContext.Consumer

// props.user could be set in localStorage or pulled from an API call
const TokenProvider = props => {
  const [token, setToken] = useLocalStorage(AUTH_TOKEN)

  // useEffect(() => {
  //   console.log('TokenProvider', 'token', token)
  // }, [token])

  console.log('TokenProvider', token)

  // Make sure to not force a re-render on the components that are reading these values,
  // unless the `token` value has changed. This is an optimisation that is mostly needed in cases
  // where the parent of the current component re-renders and thus the current component is forced
  // to re-render as well. If it does, we want to make sure to give the `TokenContext.Provider` the
  // same value as long as the token data is the same. If you have multiple other "controller"
  // components or Providers above this component, then this will be a performance booster.
  // const values = React.useMemo(() => ({ token, setToken }), [token])
  const values = { token, setToken }

  return (
    <TokenContext.Provider value={values}>
      {props.children}
    </TokenContext.Provider>
  )
}

// useToken helper wrapper around TokenContext.Consumer
const useToken = () => {
  const context = useContext(TokenContext)

  if (context === undefined) {
    throw new Error('useToken must be used within an TokenProvider')
  }

  return context
}

export { TokenProvider, TokenConsumer, useToken }
