'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { Message, NewMessage, Profile } from '@/types/models'
import { useSupabase } from '@/components/SupabaseProvider'

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

export function useConversation({ chatId }: { chatId: string }) {
  const queryClient = useQueryClient()
  const { supabase } = useSupabase()

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
          { ...newMessage, id: 0 },
        ])
      }
      // Return a context object with the snapshotted value
      return { previousMessages }
    },
    onError: (_error, _failedMessage, context) => {
      // Optimistic update 2/3: Update state with message & error
      queryClient.setQueryData(['messages'], context?.previousMessages)
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ['messages'] })
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
        (/* payload */) => {
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
    errorSending: error,
  }
}

export function useGetMessagesByChatId(chatId: string) {
  const { supabase } = useSupabase()

  const { data, isLoading } = useQuery(['messages'], async () => {
    const { data } = await supabase
      .from('messages')
      .select()
      .eq('chat_id', chatId)
    return data || []
  })

  return {
    messages: data ?? [],
    isLoading,
  }
}
