import Conversation from '@/components/Conversation'
import { createServerClient } from '@/lib/supabase'

type Props = { params: { id: string } }

export default async function Message({ params }: Props) {
  const supabase = createServerClient()

  const { data: profiles } = await supabase.from('profiles').select('*')
  const { data: messages } = await supabase
    .from('messages')
    .select()
    .eq('chat_id', params.id)

  return (
    <Conversation
      chatId={params.id}
      profiles={profiles ?? []}
      messages={messages ?? []}
    />
  )
}
