import { useMutation } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Message, NewMessage, Profile } from '@/types/models'
import { useSupabase } from '@/components/SupabaseProvider'
import { UserContext } from '@/components/UserProvider'

type MessageDisplay = {
  id: number
  content: string
  timestamp: string
  isUserMessage: boolean
  username: string
  avatarUrl: string
  error?: boolean
}

export const messageToDisplayMessage =
  (user: User | undefined, profiles: Profile[]) =>
  (m: Message): MessageDisplay => ({
    ...m,
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
  const [messages, setMessages] =
    useState<Array<Message & { error?: boolean }>>(messageHistory)

  const { mutate, error } = useMutation({
    mutationKey: ['messages'],
    mutationFn: async (message: NewMessage) => {
      // throw new Error('fake error to test mutation')
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
      console.log('new message:', newMessage)
      // Optimistic update 1/3: Show msg instantly locally
      setMessages(prev => [...prev, { ...newMessage, id: 0 }]) // spread first so that id is overwritten
      return { previousMessages: messages }
    },
    onError: (error, failedMessage, context) => {
      // Optimistic update 2/3: Update state with message & error
      // Turns out handling multiple messages with error state is quite tricky,
      // so I'm keeping it simple and allowing one, ignoring the others.
      console.error('Error:', error)
      const hasErrorMsg = messages.find(m => Boolean(m.error))
      if (!hasErrorMsg) {
        setMessages([
          ...(context?.previousMessages || []),
          { ...failedMessage, error: true, id: 0 },
        ])
      } else {
        setMessages(context?.previousMessages || [])
      }
    },
    onSuccess: messageCreated => {
      // Optimistic update 3/3: Replace local message with created in DB and removing those w/error
      setMessages(messages =>
        messages
          .filter(m => !m.error)
          .map(message => (message.id === 0 ? messageCreated : message)),
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
    sendMessage: mutate,
    errorSending: error,
  }
}
