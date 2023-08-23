'use client'

import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/SupabaseProvider'
import { useEffect } from 'react'

export default function SupabaseListener({
  serverAccessToken,
}: {
  serverAccessToken?: string
}) {
  const { supabase } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        // server and client are out of sync
        // reload the page to fetch fresh server data
        // https://beta.nextjs.org/docs/data-fetching/mutating
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [serverAccessToken, router, supabase])

  return null
}
