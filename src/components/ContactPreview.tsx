'use client'

import { css } from '../../styled-system/css'
import useAvatar from '@/components/useAvatar'
import { useContext } from 'react'
import { UserContext } from '@/components/UserProvider'
import { Profile } from '@/types/models'
import Link from 'next/link'
import { useContactPreview } from '@/app/domains/contacts/contacts.helpers'

type Props = {
  contact: Profile
}

export default function ContactPreview({ contact }: Props) {
  const { user } = useContext(UserContext)

  const { AvatarPreview } = useAvatar({
    avatarUrl: contact.avatar_url,
  })

  const { sharedChats: chats, createChatWithContact } = useContactPreview({
    user,
    contact,
  })

  const handleClick = async () => {
    if (user?.id) {
      createChatWithContact({ userId: user.id, contactId: contact.id })
    }
  }

  if (!user) {
    // TODO: withSession?
    return null
  }

  const chat = chats?.find(
    c =>
      c.users.length === 2 &&
      c.users.includes(user?.id) &&
      c.users.includes(contact.id),
  )

  return (
    <>
      {chat ? (
        <Link
          href={`/messages/${chat.chat_id}`}
          className={css({ display: 'flex', alignItems: 'center' })}
        >
          <AvatarPreview
            className={css({ borderRadius: '50%', mr: 4 })}
            size={60}
          />
          <div>{contact.username}</div>
        </Link>
      ) : (
        <button
          onClick={handleClick}
          className={css({ display: 'flex', alignItems: 'center' })}
        >
          <AvatarPreview
            className={css({ borderRadius: '50%', mr: 4 })}
            size={60}
          />
          <div>
            {contact.username} {chat ?? '(new)'}
          </div>
        </button>
      )}
    </>
  )
}
