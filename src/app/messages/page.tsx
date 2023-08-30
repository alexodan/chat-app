'use client'

import Button from '@/components/common/Button'
import Link from 'next/link'
import Image from 'next/image'
import { css } from '../../../styled-system/css'
import MessagePreviewList from '@/components/MessagePreviewList'
import { WithSessionProps, withSession } from '@/components/hoc/withSession'
import { useSupabase } from '@/components/SupabaseProvider'

async function MessagesPage({ session }: WithSessionProps) {
  const { supabase } = useSupabase()

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

export default withSession(MessagesPage)
