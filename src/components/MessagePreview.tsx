'use client'

import { css } from '../../styled-system/css'
import Link from 'next/link'
import useAvatar from '@/components/useAvatar'
import { Profile } from '@/types/models'
import { friendlyTime } from '@/app/domains/date/date.helpers'

type Props = {
  chatId: string
  contact: Profile
  content: string
  timestamp: string
}

export default function MessagePreview({
  chatId,
  contact,
  content,
  timestamp,
}: Props) {
  const { AvatarPreview } = useAvatar({
    avatarUrl: contact.avatar_url,
  })

  return (
    <Link
      href={`/messages/${chatId}`}
      className={css({
        display: 'flex',
        padding: 4,
        alignItems: 'center',
        position: 'relative',
        textDecoration: 'none',
      })}
    >
      <AvatarPreview
        className={css({ borderRadius: '50%', mr: 4 })}
        size={50}
      />
      <div>
        <h2 className={css({ fontSize: 'xl' })}>{contact.username}</h2>
        <p>{content}</p>
      </div>
      <div className={css({ position: 'absolute', right: 4 })}>
        {friendlyTime(timestamp)}
      </div>
    </Link>
  )
}
