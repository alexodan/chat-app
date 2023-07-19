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
  const supabase = createServerComponentClient({
    cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <SupabaseProvider session={session}>
          <SupabaseListener serverAccessToken={session?.access_token} />
          <Menu />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
