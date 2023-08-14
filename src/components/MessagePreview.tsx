'use client'

import { css } from '../../styled-system/css'
import Link from 'next/link'
import useAvatar from '@/components/useAvatar'
import { cx } from '@chakra-ui/utils'
import { styled } from '@chakra-ui/react'

type Props = {
  chatId: string
  contact: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

export default function Contact({ chatId, contact }: Props) {
  const { AvatarPreview } = useAvatar({
    avatarUrl: contact.avatar_url,
    size: 50,
  })

  return (
    <Link
      href={`/messages/${chatId}`}
      className={css({
        borderBottom: '1px solid gray',
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
