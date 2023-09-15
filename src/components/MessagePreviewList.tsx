'use client'

import { Chat, Message, Profile } from '@/types/models'
import { useSupabase } from './SupabaseProvider'
import MessagePreview from './MessagePreview'
import { css } from '../../styled-system/css'

export default function MessagePreviewList({
  chats,
  lastMessages,
  contacts,
}: {
  chats: Chat[]
  lastMessages: { [key: string]: Message }
  contacts: Profile[]
}) {
  const { session } = useSupabase()

  return (
    <ul className={css({})}>
      {chats.map(chat => {
        const userId = chat.users
          .filter(userId => userId !== session?.user.id)
          .at(0)
        // Note: For now I'm only handling one on one chats.
        const contactInChat = contacts.find(contact => contact.id === userId)
        const message = lastMessages[chat.chat_id]

        if (!contactInChat || !message?.content || !message?.timestamp) {
          return null
        }

        return (
          <li key={chat.chat_id}>
            <MessagePreview
              chatId={chat.chat_id}
              contact={contactInChat}
              content={message.content}
              timestamp={message.timestamp}
            />
          </li>
        )
      })}
    </ul>
  )
}
