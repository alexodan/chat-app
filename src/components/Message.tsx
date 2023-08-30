'use client'

import useAvatar from './useAvatar'
import { NewMessage } from '@/types/models'
import { css } from '../../styled-system/css'
import { useContext } from 'react'
import { UserContext } from './UserProvider'
import { usePathname } from 'next/navigation'

type Props = {
  isOwnMessage: boolean
  username: string
  timestamp: string
  content: string
  avatarUrl: string
  // errorSending: boolean
  // eslint-disable-next-line
  // retrySend: (message: NewMessage) => void
}

export default function Message(props: Props) {
  const {
    isOwnMessage,
    username,
    timestamp,
    content,
    avatarUrl,
    // errorSending,
    // retrySend,
  } = props

  const path = usePathname()
  const { AvatarPreview } = useAvatar({ avatarUrl: avatarUrl })
  const { user } = useContext(UserContext)

  const chatId = path.split('/').pop()
  const userId = user?.id

  if (!userId || !chatId) {
    return null
  }

  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: isOwnMessage ? 'end' : 'start',
      })}
    >
      {isOwnMessage ? null : (
        <AvatarPreview className={css({ borderRadius: '50%' })} size={60} />
      )}
      <div
        className={css({
          bg: isOwnMessage ? 'teal.400' : 'teal.200',
          p: 2,
          borderRadius: isOwnMessage
            ? '10px 0px 10px 10px'
            : '0px 10px 10px 10px',
        })}
      >
        {username} {isOwnMessage ? '(you)' : ''}: {content}
      </div>
      {/* {isOwnMessage && errorSending ? (
        <button
          className={css({ color: 'red.600', fontWeight: '600' })}
          onClick={() =>
            retrySend({
              content: content,
              timestamp: timestamp,
              user_id: userId,
              chat_id: chatId,
            })
          }
        >
          ❗️ Retry
        </button>
      ) : null} */}
    </div>
  )
}
