import './global.css'
import { Inter } from 'next/font/google'
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
import { createServerClient } from '@/lib/supabase'

const inter = Inter({ subsets: ['latin'] })

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
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <SupabaseProvider session={session}>
          <QueryWrapper>
            <SupabaseListener serverAccessToken={session?.access_token} />
            <Menu />
            {children}
          </QueryWrapper>
        </SupabaseProvider>
      </body>
    </html>
  )
}
