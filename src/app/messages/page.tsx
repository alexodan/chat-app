import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '@/types/supabase'
import { cookies } from 'next/headers'
import MessagePreview from '@/components/MessagePreview'
import Button from '@/components/common/Button'
import Link from 'next/link'

export default async function MessagesPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return redirect('/login')
  }

  const { data: contacts } = await supabase.from('profiles').select('*')

  const { data: chats } = await supabase.from('chats').select('*')

  return (
    <>
      <ul>
        {chats?.map(chat => {
          // NOTE: Group chats (for later as a bonus)
          const userId = chat.users
            .filter(userId => userId !== session.user.id)
            .at(0)
          const userInChat = contacts
            ?.filter(contact => contact.id === userId)
            .at(0)!

          return (
            <li key={chat.chat_id}>
              <MessagePreview chatId={chat.chat_id} contact={userInChat} />
            </li>
          )
        })}
      </ul>
      <Button>
        <Link href="/messages/new">Start a new conversation</Link>
      </Button>
    </>
  )
}
