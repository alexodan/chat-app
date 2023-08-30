'use client'

import Button from '@/components/common/Button'
import Link from 'next/link'
import Image from 'next/image'
import { css } from '../../../styled-system/css'
import MessagePreviewList from '@/components/MessagePreviewList'
import { useSupabase } from '@/components/SupabaseProvider'
import { redirect } from 'next/navigation'

async function MessagesPage() {
  const { session, supabase } = useSupabase()

  if (!session?.user) {
    redirect('/login')
  }

  const { data: chats } = await supabase
    .from('chats')
    .select('chat_id, users')
    .contains('users', [session?.user.id])

  return (
    <>
      <MessagePreviewList chats={chats || []} />
      <Button
        fullWidth={false}
        className={css({ position: 'absolute', bottom: '4', right: '4' })}
      >
        <Link href="/messages/new">
          <Image
            src="/message.svg"
            alt="New conversation"
            height={30}
            width={30}
          />
        </Link>
      </Button>
    </>
  )
}

export default MessagesPage
