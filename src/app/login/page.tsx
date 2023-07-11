import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { css } from '../../../styled-system/css'
import LoginForm from '@/app/login/login-form'

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div
      className={css({
        h: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minW: '320px',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDir: 'column',
        })}
      >
        <div className={css({ textAlign: 'center' })}>
          <h1 className={css({ fontSize: '3xl' })}>Welcome back!</h1>
          <p className={css({ fontSize: 'sm', mb: 2 })}>Start messaging</p>
        </div>
        <div>
          <LoginForm session={session} />
        </div>
      </div>
    </div>
  )
}
