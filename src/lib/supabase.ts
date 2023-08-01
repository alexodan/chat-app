import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { cookies } from 'next/headers'

export function createServerClient() {
  return createServerComponentClient<Database>({
    cookies,
  })
}
