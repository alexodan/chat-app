'use client'

import {
  createPagesBrowserClient,
  Session,
} from '@supabase/auth-helpers-nextjs'
import { createContext, useContext, useState } from 'react'
import { TypedSupabaseClient } from '@/app/layout'

type SupabaseContext = {
  supabase: TypedSupabaseClient
  session: Session | null
}

const Context = createContext<SupabaseContext>({} as SupabaseContext)

export default function SupabaseProvider({
  session,
  children,
}: {
  session: Session | null
  children: React.ReactNode
}) {
  // TODO: ref?
  const [supabase] = useState(() => createPagesBrowserClient())

  return (
    <Context.Provider value={{ supabase, session }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => useContext(Context)
