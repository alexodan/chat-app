'use client'

import Link from 'next/link'
import useAvatar from '@/components/useAvatar'
import { css } from '../../styled-system/css'
import { useContext } from 'react'
import { UserContext } from '@/components/UserProvider'
import { Profile } from '@/types/models'
import { useContactPreview } from '@/app/domains/contacts/contacts.helpers'

type Props = {
  contact: Profile
}

export function useStatus() {
  return {
    isUserOnline: (contact: Profile) =>
      contact?.timestamp_last_connection
        ? (Date.parse(new Date().toISOString()) -
            Date.parse(contact.timestamp_last_connection)) /
            1000 <
          60
        : false,
    UserStatus: ({ isOnline }: { isOnline: boolean }) => (
      <div
        className={css({
          width: 4,
          height: 4,
          border: '2px solid white',
          borderRadius: '50%',
          bg: isOnline ? 'green.400' : 'red.400',
          position: 'absolute',
          top: 11,
          left: 11,
        })}
      />
    ),
  }
}

export default function ContactPreview({ contact }: Props) {
  const { user } = useContext(UserContext)

  const { AvatarPreview } = useAvatar({
    avatarUrl: contact.avatar_url,
  })
  const { isUserOnline, UserStatus } = useStatus()

  const { sharedChats: chats, createChatWithContact } = useContactPreview({
    user,
    contact,
  })

  const handleClick = async () => {
    if (user?.id && user.id !== contact.id) {
      createChatWithContact({ userId: user.id, contactId: contact.id })
    }
  }

  const chat = chats?.find(
    c =>
      c.users.length === 2 &&
      c.users.includes(user!.id) &&
      c.users.includes(contact.id),
  )

  const isOnline = isUserOnline(contact)
  return (
    <>
      {chat ? (
        <Link
          href={`/messages/${chat.chat_id}`}
          className={css({
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          })}
        >
          <UserStatus isOnline={isOnline} />
          <AvatarPreview
            className={css({ borderRadius: '50%', mr: 4 })}
            size={60}
          />
          <div>{contact.username}</div>
        </Link>
      ) : (
        <button
          onClick={handleClick}
          className={css({
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            width: '100%',
            cursor: 'pointer',
          })}
        >
          <UserStatus isOnline={isOnline} />
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
