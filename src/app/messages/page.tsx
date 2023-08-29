import MessagePreview from '@/components/MessagePreview'
import Button from '@/components/common/Button'
import Link from 'next/link'
import Image from 'next/image'
import { Database } from '@/types/supabase'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { css } from '../../../styled-system/css'

export default async function MessagesPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: contacts } = await supabase.from('profiles').select('*')

  const { data: chats } = await supabase
    .from('chats')
    .select('chat_id, users')
    .contains('users', [session?.user.id])

  return (
    <>
      <ul>
        {chats?.map(chat => {
          const userId = chat.users
            .filter(userId => userId !== session?.user.id)
            .at(0)
          // Note: For now I'm only handling one on one chats.
          const contactInChat = contacts?.find(contact => contact.id === userId)

          // Note: (BUG) Both users in chat had the same id
          if (!contactInChat) {
            return null
          }

          return (
            <li key={chat.chat_id}>
              <MessagePreview chatId={chat.chat_id} contact={contactInChat} />
            </li>
          )
        })}
      </ul>
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
