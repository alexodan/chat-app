'use client'

import Link from 'next/link'
import { useSupabase } from './SupabaseProvider'
import { css } from '../../styled-system/css'
import { useGetProfiles } from '../app/domains/profiles/profiles.helpers'
import { useGetUserLastMessages } from '@/app/domains/messages/messages.helpers'
import MessagePreview from './MessagePreview'

export default function MessagePreviewList() {
  const { session } = useSupabase()

  const { messages: lastMessages, isLoading } = useGetUserLastMessages(
    session?.user.id,
  )

  const { profiles, isLoading: loadingProfiles } = useGetProfiles()

  if (isLoading || loadingProfiles) {
    return <p>Loading...</p>
  }

  return (
    <ul
      className={css({
        display: 'flex',
        flexDir: 'column',
        flexGrow: 1,
      })}
    >
      {lastMessages ? (
        Array.from(lastMessages.values()).map(message => {
          const recipientId = message.chat.users.find(
            u => u !== session?.user.id,
          )
          return (
            <li key={message.chat.chat_id}>
              <MessagePreview
                chatId={message.chat.chat_id}
                contact={
                  profiles.find(profileUser => profileUser.id === recipientId)!
                }
                content={message.content!}
                timestamp={message.timestamp!}
              />
            </li>
          )
        })
      ) : (
        <div
          className={css({
            display: 'flex',
            flexDir: 'column',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          })}
        >
          <Link
            className={css({
              bg: 'teal.950',
              color: 'white',
              textDecoration: 'none',
              padding: 2,
              borderRadius: 12,
            })}
            href="/messages/new"
          >
            Start a conversation!
          </Link>
        </div>
      )}
    </ul>
  )
}
