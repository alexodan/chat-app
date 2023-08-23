'use client'

import React from 'react'
import { User } from '@supabase/gotrue-js'

type UserContextType = {
  user: User | undefined
}

export const UserContext = React.createContext<UserContextType>({
  user: undefined,
})

export const UserContextProvider = ({
  children,
  user,
}: {
  children: React.ReactNode
  user: User | undefined
}) => {
  return (
    <UserContext.Provider
      value={{
        user: user,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
