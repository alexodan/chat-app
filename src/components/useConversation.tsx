import { useMutation } from '@tanstack/react-query'
import { useSupabase } from './SupabaseProvider'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from './UserProvider'
import { User } from '@supabase/supabase-js'
import { Message, NewMessage, Profile } from '@/types/models'

type MessageDisplay = {
  id: number
  content: string
  timestamp: string
  isUserMessage: boolean
  username: string
  avatarUrl: string
}

export const messageToDisplayMessage =
  (user: User | undefined, profiles: Profile[]) =>
  (m: Message): MessageDisplay => ({
    id: m.id,
    content: m.content!,
    timestamp: m.timestamp!,
    isUserMessage: m.user_id == user?.id,
    username: profiles.find(p => p.id === m.user_id)?.username!,
    avatarUrl: profiles.find(p => p.id === m.user_id)?.avatar_url!,
  })

export function useConversation({
  chatId,
  messageHistory,
  usersInConversation,
}: {
  chatId: string
  messageHistory: Message[]
  usersInConversation: Profile[]
}) {
  const { supabase } = useSupabase()
  const { user } = useContext(UserContext)
  const [messages, setMessages] = useState(
    messageHistory.map(messageToDisplayMessage(user, usersInConversation)),
  )

  const sendMessageMutation = useMutation(async (message: NewMessage) => {
    const { error } = await supabase.from('messages').insert([message]).single()
    if (error) {
      throw error
    }
  })

  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on<Message>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        payload => {
          const newMessage = payload.new
          setMessages(prev => [
            ...prev,
            messageToDisplayMessage(user, usersInConversation)(newMessage),
          ])
        },
      )
      .subscribe()
    return () => {
      channel.unsubscribe()
    }
  }, [chatId, supabase, user, usersInConversation])

  return {
    messages,
    sendMessage: sendMessageMutation.mutate,
  }
}
