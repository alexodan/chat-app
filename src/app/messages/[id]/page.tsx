'use client'

import { useGetChat } from '@/app/domains/chats/chats.helpers'
import { useGetMessagesByChatId } from '@/app/domains/messages/messages.helpers'
import { useGetProfiles } from '@/app/domains/profiles/profiles.helpers'
import Conversation from '@/components/Conversation'
import { withSession } from '@/components/hoc/withSession'

type Props = { params: { id: string } }

function MessagesPage({ params }: Props) {
  const { profiles } = useGetProfiles()

  const { chat } = useGetChat(params.id)

  const { messages } = useGetMessagesByChatId(params.id)

  const usersInChat = profiles?.filter(user => chat?.users.includes(user.id))

  return (
    <Conversation
      chatId={params.id}
      users={usersInChat ?? []}
      messages={messages}
    />
  )
}

export default withSession(MessagesPage)
