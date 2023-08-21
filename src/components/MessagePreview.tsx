'use client'

import { css } from '../../styled-system/css'
import Link from 'next/link'
import useAvatar from '@/components/useAvatar'
import { Profile } from '@/types/models'

type Props = {
  chatId: string
  contact: Profile
}

export default function MessagePreview({ chatId, contact }: Props) {
  const { AvatarPreview } = useAvatar({
    avatarUrl: contact.avatar_url,
    size: 50,
  })

  return (
    <Link
      href={`/messages/${chatId}`}
      className={css({
        borderBottom: '1px solid black',
        display: 'flex',
        padding: 4,
      })}
    >
      <AvatarPreview className={css({ borderRadius: '50%', mr: 4 })} />
      <div>
        {contact.full_name} - Chat id: {chatId}
      </div>
    </Link>
  )
}
