'use client'

import { useSupabase } from '@/components/SupabaseProvider'
import { useQuery } from '@tanstack/react-query'

export function useGetProfiles() {
  const { supabase } = useSupabase()

  const {
    data: profiles,
    isLoading,
    ...rest
  } = useQuery(['profiles'], async () => {
    const { data } = await supabase.from('profiles').select('*')
    return data
  })

  return {
    profiles: profiles ?? [],
    isLoading,
    ...rest,
  }
}
