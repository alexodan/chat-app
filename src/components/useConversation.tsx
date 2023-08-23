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
  const [messages, setMessages] = useState(messageHistory)

  const sendMessageMutation = useMutation({
    mutationKey: ['messages'],
    mutationFn: async (message: NewMessage) => {
      const { data, error } = await supabase
        .from('messages')
        .insert([message])
        .select()
        .single()
      if (error) {
        throw error
      }
      return data
    },
    onMutate: async newMessage => {
      // Setting messages with a dummy message
      setMessages(prev => [...prev, { id: 0, ...newMessage }])
      return { previousMessages: messages }
    },
    onError: (error, _, context) => {
      // Remove optimistic message from the messages list
      setMessages(context?.previousMessages || [])
    },
    onSuccess: messageCreated => {
      // Replacing dummy message with id 0 with message inserted in DB
      setMessages(messages =>
        messages.filter(message =>
          message.id === 0 ? messageCreated : message,
        ),
      )
    },
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
          // Given I'm doing optimistic updates I'm filtering
          // messages that are not from the user, which can't
          // be done with supabase filter (library limitations)
          if (newMessage.user_id !== user?.id) {
            setMessages(prev => [...prev, newMessage])
          }
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
