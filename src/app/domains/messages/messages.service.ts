import { Chat, Message } from '@/types/models'
import { Database } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getLastMessageByChat({ chats }: { chats: Chat[] }) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: messages } = await supabase
    .from('messages')
    .select()
    .in('chat_id', [chats.map(chat => chat.chat_id)])
    .order('timestamp', { ascending: false })

  // Grouping messages by chat (Supabase doesn't have a groupBy method)
  // See more at https://github.com/orgs/supabase/discussions/9415
  const messagesGroupedByChat = (messages || []).reduce((map, message) => {
    if (!map[message.chat_id]) {
      map[message.chat_id] = message
    }
    return map
  }, {} as { [key: string]: Message })

  return messagesGroupedByChat
}
