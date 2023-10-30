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
      className={css({
        minH: '100%',
        display: 'flex',
        flexDir: 'column',
        md: { backgroundColor: 'teal.950' },
      })}
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
          position: 'relative',
          lg: {
            margin: '2rem auto',
            padding: 2,
            width: 'breakpoint-lg',
          },
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
