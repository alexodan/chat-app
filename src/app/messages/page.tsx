import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '@/types/supabase'
import { cookies } from 'next/headers'
import Contact from '@/components/Contact'
import { css } from '../../../styled-system/css'
import { Message, Profile } from '@/components/Conversation'

export default async function MessagesPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    return redirect('/login')
  }

  const { data: contacts } = await supabase.from('profiles').select('*')

  const { data: userMessages } = await supabase
    .from('messages')
    .select('id, chat_id, from_user, to_user, content, timestamp')
    .or(
      `from_user.eq.${data.session.user.id}, to_user.eq.${data.session.user.id}`,
    )

  const conversations = userMessages?.reduce(
    (aggregation, message) => {
      const chatId = message.chat_id
      const contact = contacts?.find(
        contact =>
          contact.id === message.from_user || contact.id === message.to_user,
      )
      const messages = aggregation.get(chatId)?.messages ?? []
      return aggregation.set(chatId, {
        chatId,
        contact: contact!,
        messages: [...messages, message],
      })
    },
    new Map<
      string,
      {
        chatId: string
        contact: Profile
        messages: Message[]
      }
    >(),
  )

  return (
    <>
      <h2 className={css({ borderBottom: '1px solid gray', fontSize: 'xl' })}>
        Messages
      </h2>
      <ul>
        {Array.from(conversations?.values() ?? []).map(conversation => (
          <Contact
            key={conversation.chatId}
            chatId={conversation.chatId}
            contact={conversation.contact}
          />
        ))}
      </ul>
      {/*<h2 className={css({ borderBottom: '1px solid gray', fontSize: 'xl' })}>*/}
      {/*  Contacts*/}
      {/*</h2>*/}
      {/*<ul>*/}
      {/*  {displayContacts.map(contact => (*/}
      {/*    <Contact key={contact.id} contact={contact} />*/}
      {/*  ))}*/}
      {/*</ul>*/}
    </>
  )
}
