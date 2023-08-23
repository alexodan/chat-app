'use client'

import { useSupabase } from '@/components/SupabaseProvider'
import { MouseEvent, useState } from 'react'
import { css } from '../../styled-system/css'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Message from './Message'
import { messageToDisplayMessage, useConversation } from './useConversation'
import { Message as MessageModel, NewMessage, Profile } from '@/types/models'

export default function Conversation({
  chatId,
  users,
  messages: messageHistory,
}: {
  chatId: string
  users: Profile[]
  messages: MessageModel[]
}) {
  const { session } = useSupabase()

  const [message, setMessage] = useState('')

  const { messages, sendMessage } = useConversation({
    chatId,
    messageHistory,
    usersInConversation: users,
  })

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!message) return

    const messageToSend: NewMessage = {
      chat_id: chatId,
      user_id: session?.user.id!,
      content: message,
      timestamp: new Date().toISOString(),
    }
    sendMessage(messageToSend)

    // if (mutation.isError) {
    //   // TODO: display error next to message?
    // }

    setMessage('')
  }

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
            />
          </li>
        ))}
      </ul>
      <div className={css({ display: 'flex' })}>
        <Input
          type="text"
          fullWidth
          className={css({ borderRadius: '0!' })}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <Button className={css({ borderRadius: '0!' })} onClick={handleSubmit}>
          Send
        </Button>
      </div>
    </div>
  )
}
