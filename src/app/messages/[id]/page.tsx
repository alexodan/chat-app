'use client'

import { useGetChat } from '@/app/domains/chats/chats.helpers'
import { useGetMessagesByChatId } from '@/app/domains/messages/messages.helpers'
import { useGetProfiles } from '@/app/domains/profiles/profiles.helpers'
import Conversation from '@/components/Conversation'

type Props = { params: { id: string } }

function MessagesPage({ params }: Props) {
  const chatId = params.id

  const { profiles } = useGetProfiles()

  const { chat } = useGetChat(chatId)

  const { messages } = useGetMessagesByChatId(chatId)

  const usersInChat = profiles?.filter(user => chat?.users.includes(user.id))

  return (
    <Conversation
      chatId={chatId}
      users={usersInChat ?? []}
      messages={messages ?? []}
    />
  )
}

export default MessagesPage
