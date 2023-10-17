'use client'

import { redirect } from 'next/navigation'
import { useSupabase } from '../../../components/SupabaseProvider'
import { Session } from '@supabase/supabase-js'

export type WithSessionProps = {
  session: Session
}

export function withSession<TProps = WithSessionProps>(
  WrappedComponent: React.ComponentType<TProps>,
) {
  const ComponentWithSession = (
    props: React.ComponentProps<typeof WrappedComponent>,
  ): React.ReactElement<typeof props> => {
    const { session } = useSupabase()

    if (!session) {
      redirect('/login')
    }

    return <WrappedComponent {...(props as TProps)} session={session} />
  }

  return ComponentWithSession
}
