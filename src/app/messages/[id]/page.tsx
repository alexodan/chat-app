import { redirect } from 'next/navigation'
import Conversation from '@/components/Conversation'
import { createServerClient } from '@/lib/supabase'

export default async function Message() {
  const supabase = createServerClient()

  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    return redirect('/login')
  }

  const { data: userMessages } = await supabase
    .from('messages')
    .select('id, chat_id, from_user, to_user, content, timestamp')
    .or(
      `from_user.eq.${data.session.user.id}, to_user.eq.${data.session.user.id}`,
    )

  const toUserId = userMessages?.find(
    message => message.to_user !== data.session.user.id,
  )?.to_user

  const toUser = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url, updated_at')
    .eq('id', toUserId)
    .single()

  // TODO: should I put this into context instead?
  const userProfile = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url, updated_at')
    .eq('id', data.session.user.id)
    .single()

  if (userProfile.error || toUser.error) {
    // TODO: is this even correct
    return redirect('/login')
  }

  return (
    <Conversation
      userMessages={userMessages ?? []}
      userRecipient={toUser.data}
      userProfile={userProfile.data}
    />
  )
}
