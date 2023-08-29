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
      <AvatarPreview
        className={css({ borderRadius: '50%', mr: 4 })}
        size={50}
      />
      <div>
        {contact.username} - Chat id: {chatId}
      </div>
    </Link>
  )
}
