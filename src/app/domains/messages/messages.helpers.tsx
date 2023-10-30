'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { Chat, Message, NewMessage, Profile } from '@/types/models'
import { useSupabase } from '@/components/SupabaseProvider'

type MessageDisplay = {
  id: string
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
}: {
  chatId: string
  messageHistory: Message[]
}) {
  const queryClient = useQueryClient()
  const { supabase } = useSupabase()

  const { mutate: retryMutation } = useMutation({
    mutationKey: ['messages-retry'],
    mutationFn: async (failedMessage: NewMessage) => {
      const { data, error } = await supabase
        .from('messages')
        .insert([failedMessage])
        .select()
        .single()
      if (error) {
        throw error
      }
      return data
    },
    onSuccess: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })

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
      // Optimistic update 1/3: Show msg instantly locally
      await queryClient.cancelQueries({ queryKey: ['messages'] })
      // Snapshot the previous value
      const previousMessages =
        queryClient.getQueryData<Message[]>(['messages']) || []
      // Optimistically update to the new value
      if (previousMessages) {
        queryClient.setQueryData<Message[]>(['messages'], old => [
          ...(old || []),
          { ...newMessage, id: '0' },
        ])
      }
      // Return a context object with the snapshotted value
      return { previousMessages }
    },
    onError: (_error, failedMessage, context) => {
      // Optimistic update 2/3: Mark failed message
      queryClient.setQueryData<Message[]>(
        ['messages'],
        [
          ...(context?.previousMessages || []),
          {
            ...failedMessage,
            id: `failed-${context?.previousMessages.length}`,
          },
        ],
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
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages'] })
        },
      )
      .subscribe()
    return () => {
      channel.unsubscribe()
    }
  }, [chatId, supabase, queryClient])

  return {
    sendMessage: mutate,
    retrySendMessage: retryMutation,
    errorSending: error,
  }
}

export function useGetMessagesByChatId(chatId: string) {
  const { supabase } = useSupabase()

  const { data, isLoading, ...rest } = useQuery(
    ['messages', chatId],
    async () => {
      const { data } = await supabase
        .from('messages')
        .select()
        .eq('chat_id', chatId)
        .order('timestamp', {
          ascending: true,
        })
      return data
    },
  )

  return {
    messages: data,
    isLoading,
    ...rest,
  }
}

export function useGetUserLastMessages(userId: string | undefined) {
  const { supabase } = useSupabase()

  const { data, ...rest } = useQuery(['getLastMessageByChat'], async () => {
    if (!userId) {
      return []
    }
    const { data: chats } = await supabase
      .from('chats')
      .select('chat_id, users')
      .contains('users', [userId])
    const { data: messages } = await supabase
      .from('messages')
      .select()
      .in('chat_id', [chats?.map(chat => chat.chat_id) ?? ''])
      .order('timestamp', { ascending: false })

    return (
      messages?.map(message => ({
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        user_id: message.user_id,
        chat: chats?.find(c => c.chat_id === message.chat_id)!,
      })) ?? []
    )
  })

  // Grouping messages by chat (Supabase doesn't have a groupBy method)
  // See more at https://github.com/orgs/supabase/discussions/9415
  const messagesGroupedByChat = data?.reduce((map, message) => {
    if (!map.get(message.chat?.chat_id!)) {
      map.set(message.chat?.chat_id!, message)
    }
    return map
  }, new Map<string, Omit<Message, 'chat_id'> & { chat: Chat }>())

  return {
    messages: messagesGroupedByChat,
    ...rest,
  }
}
