import { Database } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getProfiles() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data } = await supabase.from('profiles').select('*')
  return data
}
