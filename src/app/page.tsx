import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { css } from '../../styled-system/css'
import Link from 'next/link'

export default async function LandingPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div
      className={css({
        h: '100vh',
      })}
    >
      <h1>Landing</h1>
      <Link href="/login">Login</Link>
    </div>
  )
}
