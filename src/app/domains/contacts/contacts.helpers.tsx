'use client'

import { useSupabase } from '@/components/SupabaseProvider'
import { Message, Profile } from '@/types/models'
import { User } from '@supabase/supabase-js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function convertToMap<T, TKey extends keyof T>(
  array: T[],
  keyT: TKey,
): Map<T[TKey], T> {
  const map = new Map<T[TKey], T>()
  for (const value of array) {
    const id = value[keyT]
    if (!map.get(id)) {
      map.set(id, value)
    }
  }
  return map
}

function groupMessagesByUser(messages: Message[]) {
  const map = new Map<string, Message[]>()
  for (const message of messages) {
    const id = message.user_id
    if (!map.get(id)) {
      map.set(id, messages)
    }
  }
  return map
}

// TODO: move this to contacts.service.ts
export function useContactsPreview({ userId }: { userId: string }) {
  const { supabase } = useSupabase()

  const { data: sortedContacts } = useQuery(['contactsPreview'], async () => {
    if (!userId) return null

    const { data: profiles } = await supabase.from('profiles').select('*')
    const { data: messages } = await supabase.from('messages').select('*')

    const messagesGroupedByUser = groupMessagesByUser(messages || [])

    return profiles
      ?.filter(profile => profile.id !== userId)
      .map(profile => ({
        ...profile,
        lastMessageTimestamp:
          messagesGroupedByUser.get(profile.id)?.[0]?.timestamp || '', // todo? this looks fragile
      }))
      .sort((c1, c2) =>
        c1.lastMessageTimestamp < c2.lastMessageTimestamp ? 1 : -1,
      )
  })

  return {
    sortedContacts: sortedContacts || [],
  }
}

export function useContactPreview({
  user,
  contact,
}: {
  user: User | undefined
  contact: Profile
}) {
  const router = useRouter()
  const { supabase } = useSupabase()

  const { data: sharedChats } = useQuery(
    [`contact-preview-${contact.id}`],
    async () => {
      if (!user) return null
      const chats = await supabase
        .from('chats')
        .select('*')
        .contains('users', [user.id, contact.id])
      return chats.data
    },
  )

  const createChatWithContactMutation = useMutation({
    mutationFn: async ({
      userId,
      contactId,
    }: {
      userId: string
      contactId: string
    }) => {
      if (!user) return null
      const { data } = await supabase
        .from('chats')
        .insert({
          users: [userId, contactId],
        })
        .select()
        .single()
      if (!data) {
        throw new Error('Creating a new chat has failed')
      }
      return data
    },
    onSuccess: data => {
      if (data) {
        router.push(`/messages/${data.chat_id}`)
      }
    },
  })

  return {
    sharedChats,
    createChatWithContact: createChatWithContactMutation.mutateAsync,
  }
}
