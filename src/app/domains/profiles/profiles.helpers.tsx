'use client'

import { useSupabase } from '@/components/SupabaseProvider'
import { useMutation, useQuery } from '@tanstack/react-query'

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

export function useUpdateUserConnection() {
  const { supabase } = useSupabase()

  const mutation = useMutation(['updateUserConnection'], async () => {
    const { data } = await supabase.auth.getSession()
    await supabase
      .from('profiles')
      .update({
        timestamp_last_connection: new Date().toISOString().toLocaleString(),
      })
      .eq('id', data.session?.user.id)
    return data
  })

  return {
    updateActiveTime: mutation.mutate,
    ...mutation,
  }
}
