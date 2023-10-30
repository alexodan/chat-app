import AccountDetail from '@/app/account/account-detail'
import { Database } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { css } from '../../../styled-system/css'
import { Suspense } from 'react'
import Loading from './loading'

export default async function AccountPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  // TODO: It's so weird to fetch the user all the time
  const user = (await supabase.auth.getSession()).data.session?.user

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className={css({ px: 4, py: 2 })}>
      {/* I would expect to render this h2 and the skeleton below while loading the profile */}
      {/* I think it has to do with using layout and not page */}
      <h2 className={css({ fontSize: '2xl' })}>Account details</h2>
      <Suspense fallback={<Loading />}>
        <AccountDetail user={{ ...profile, email: user?.email! }} />
      </Suspense>
    </div>
  )
}
