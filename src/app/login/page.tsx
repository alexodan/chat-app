import { css } from '../../../styled-system/css'
import LoginForm from '@/app/login/login-form'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { cookies } from 'next/headers'

export default async function HomePage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/messages')
  }

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
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
