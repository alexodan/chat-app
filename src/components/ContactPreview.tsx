'use client'

import { css } from '../../styled-system/css'
import useAvatar from '@/components/useAvatar'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { useContext } from 'react'
import { UserContext } from '@/components/UserProvider'
import { Profile } from '@/types/models'

type Props = {
  contact: Profile
}

export default function ContactPreview({ contact }: Props) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const { user } = useContext(UserContext)

  const { AvatarPreview } = useAvatar({
    avatarUrl: contact.avatar_url,
    size: 60,
  })

  const handleClick = async () => {
    // TODO: check the chatId not to create multiple chats for the same users
    const { data, error } = await supabase
      .from('chats')
      .insert({
        users: [user?.id!, contact.id],
      })
      .select()
      .single()
    if (error) {
      return
    }
    router.push(`/messages/${data.chat_id}`)
  }

  return (
    // onClick on a div 🤔
    <div className={css({ display: 'flex' })} onClick={handleClick}>
      <AvatarPreview className={css({ borderRadius: '50%', mr: 4 })} />
      <div>{contact.username}</div>
    </div>
  )
}
