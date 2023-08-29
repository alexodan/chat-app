import { useGetChat } from '@/app/domains/chats/chats.helpers'
import { useGetMessagesByChatId } from '@/app/domains/messages/messages.helpers'
import { useGetProfiles } from '@/app/domains/profiles/profiles.helpers'
import Conversation from '@/components/Conversation'
import { Database } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type Props = { params: { id: string } }

export default async function MessagesPage({ params }: Props) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })
  const { data: session } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

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
