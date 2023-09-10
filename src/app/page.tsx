import Link from 'next/link'
import { css } from '../../styled-system/css'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { cookies } from 'next/headers'

export default async function LandingPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data } = await supabase.auth.getSession()

  return (
    <div
      className={css({
        h: '100vh',
      })}
    >
      <h1>Landing</h1>
      {!data.session && <Link href="/login">Login</Link>}
    </div>
  )
}
