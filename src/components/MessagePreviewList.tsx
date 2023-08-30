'use client'

import { useGetProfiles } from '@/app/domains/profiles/profiles.helpers'
import { Chat } from '@/types/models'
import { useSupabase } from './SupabaseProvider'
import MessagePreview from './MessagePreview'

export default function MessagePreviewList({ chats }: { chats: Chat[] }) {
  const { session } = useSupabase()
  const { profiles: contacts } = useGetProfiles()

  return (
    <ul>
      {chats?.map(chat => {
        const userId = chat.users
          .filter(userId => userId !== session?.user.id)
          .at(0)
        // Note: For now I'm only handling one on one chats.
        const contactInChat = contacts?.find(contact => contact.id === userId)

        if (!contactInChat) {
          // (BUG) If this happens is that both users in chat had the same id
          return null
        }

        return (
          <li key={chat.chat_id}>
            <MessagePreview chatId={chat.chat_id} contact={contactInChat} />
          </li>
        )
      })}
    </ul>
  )
}
