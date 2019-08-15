import React, { useContext, useState, useEffect } from 'react'

const UserContext = React.createContext()

const UserConsumer = UserContext.Consumer

// props.user could be set in localStorage or pulled from an API call
const UserProvider = props => {
  const [user, setUser] = useState(false)

  // Make sure to not force a re-render on the components that are reading these values,
  // unless the `User` value has changed. This is an optimisation that is mostly needed in cases
  // where the parent of the current component re-renders and thus the current component is forced
  // to re-render as well. If it does, we want to make sure to give the `UserContext.Provider` the
  // same value as long as the User data is the same. If you have multiple other "controller"
  // components or Providers above this component, then this will be a performance booster.
  // const values = React.useMemo(() => ({ user, setUser }), [user])
  const values = { user, setUser }

  return (
    <UserContext.Provider value={values}>{props.children}</UserContext.Provider>
  )
}

// useUser helper wrapper around UserContext.Consumer
const useUser = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useUser must be used within an UserProvider')
  }

  return context
}

export { UserProvider, UserConsumer, useUser }
