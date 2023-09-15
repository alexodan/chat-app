'use client'

import { useGetChat } from '@/app/domains/chats/chats.helpers'
import { useGetMessagesByChatId } from '@/app/domains/messages/messages.helpers'
import { useGetProfiles } from '@/app/domains/profiles/profiles.helpers'
import Conversation from '@/components/Conversation'
import Loading from '@/components/common/Loading'

type Props = { params: { id: string } }

function MessagesPage({ params }: Props) {
  const chatId = params.id

  const { profiles } = useGetProfiles()

  const { chat } = useGetChat(chatId)

  const { messages, isLoading } = useGetMessagesByChatId(chatId)

  const usersInChat = profiles?.filter(user => chat?.users.includes(user.id))

  if (isLoading) {
    return <Loading height={100} width={100} />
  }

  return (
    <Conversation
      chatId={chatId}
      users={usersInChat ?? []}
      messages={messages ?? []}
    />
  )
}

export default MessagesPage
