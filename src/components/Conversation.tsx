'use client'

import { useSupabase } from '@/components/SupabaseProvider'
import { FormEvent, useState } from 'react'
import { css } from '../../styled-system/css'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Message from './Message'
import { Message as MessageModel, NewMessage, Profile } from '@/types/models'
import {
  messageToDisplayMessage,
  useConversation,
} from '@/app/domains/messages/messages.helpers'

export default function Conversation({
  chatId,
  users,
  messages,
}: {
  chatId: string
  users: Profile[]
  messages: MessageModel[]
}) {
  const { session } = useSupabase()

  const [message, setMessage] = useState('')

  const { sendMessage } = useConversation({
    chatId,
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!message) return

    const messageToSend: NewMessage = {
      chat_id: chatId,
      user_id: session?.user.id!,
      content: message,
      timestamp: new Date().toISOString(),
    }
    sendMessage(messageToSend)
    setMessage('')
  }

  // const handleRetry = (message: NewMessage) => {
  //   sendMessage(message)
  // }

  const uiMessages = messages.map(messageToDisplayMessage(session?.user, users))

  return (
    <div
      className={css({
        display: 'flex',
        flexDir: 'column',
        flexGrow: 1,
        p: 2,
      })}
    >
      <ul className={css({ flexGrow: 1 })}>
        {uiMessages.map(message => (
          <li key={message.id} className={css({ mb: 2 })}>
            <Message
              isOwnMessage={message.isUserMessage}
              username={message.username}
              timestamp={message.timestamp}
              content={message.content}
              avatarUrl={message.avatarUrl}
              // errorSending={!!message.error}
              // retrySend={handleRetry}
            />
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className={css({ display: 'flex' })}>
        <Input
          label="New message"
          aria-label="New Message"
          type="text"
          fullWidth
          className={css({ borderRadius: '0!' })}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <Button type="submit" className={css({ borderRadius: '0!' })}>
          Send
        </Button>
      </form>
    </div>
  )
}
