import { useSupabase } from '@/components/SupabaseProvider'
import { useQuery } from '@tanstack/react-query'

export function useGetChat(chatId: string) {
  const { supabase } = useSupabase()

  const { data, isLoading, ...rest } = useQuery(['chat'], async () => {
    const { data: chat } = await supabase
      .from('chats')
      .select('*')
      .eq('chat_id', chatId)
      .single()
    return chat
  })

  return {
    chat: data,
    isLoading,
    ...rest,
  }
}
