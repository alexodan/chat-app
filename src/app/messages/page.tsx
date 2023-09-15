import Button from '@/components/common/Button'
import Link from 'next/link'
import Image from 'next/image'
import { css } from '../../../styled-system/css'
import MessagePreviewList from '@/components/MessagePreviewList'
import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { cookies } from 'next/headers'
import { getLastMessageByChat } from '../domains/messages/messages.service'
import { getProfiles } from '../domains/profiles/profiles.service'
import Loading from './loading'

async function MessagesPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: chats } = await supabase
    .from('chats')
    .select('chat_id, users')
    .contains('users', [session?.user.id])

  const lastMessages = await getLastMessageByChat({ chats: chats || [] })
  const contacts = await getProfiles()

  return (
    <>
      <Suspense fallback={<Loading />}>
        <MessagePreviewList
          chats={chats ?? []}
          lastMessages={lastMessages}
          contacts={contacts ?? []}
        />
      </Suspense>
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
