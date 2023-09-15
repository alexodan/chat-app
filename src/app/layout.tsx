import './global.css'
import Menu from '@/components/Menu'
import {
  createServerComponentClient,
  SupabaseClient,
} from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import SupabaseProvider from '@/components/SupabaseProvider'
import { Database } from '@/types/supabase'
import SupabaseListener from '@/components/SupabaseListener'
import QueryWrapper from '@/components/QueryWrapper'
import { UserContextProvider } from '@/components/UserProvider'
import { css } from '../../styled-system/css'

export const metadata = {
  title: 'Chat App',
  description: '',
}

export type TypedSupabaseClient = SupabaseClient<Database>

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html
      lang="en"
      className={css({ minH: '100%', display: 'flex', flexDir: 'column' })}
    >
      <body
        suppressHydrationWarning={true}
        className={css({
          display: 'flex',
          flexDir: 'column',
          flexGrow: 1,
          bgGradient: 'to-b',
          gradientFrom: 'teal.800',
          gradientTo: 'teal.100',
        })}
      >
        <SupabaseProvider session={session}>
          <QueryWrapper>
            <UserContextProvider user={session?.user}>
              <SupabaseListener serverAccessToken={session?.access_token} />
              <Menu />
              {children}
            </UserContextProvider>
          </QueryWrapper>
        </SupabaseProvider>
      </body>
    </html>
  )
}
