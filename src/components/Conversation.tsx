'use client'

import { useSupabase } from '@/components/SupabaseProvider'
import { MouseEvent, useEffect, useState } from 'react'
import { css } from '../../styled-system/css'
import Input from '@/components/common/Input'
import Message from './Message'
import { Database } from '@/types/supabase'
import Button from '@/components/common/Button'
import { usePathname } from 'next/navigation'

// TODO: move this types
export type Message = Database['public']['Tables']['messages']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

type MessageDisplay = {
  id: number
  content: string | null
  timestamp: string | null
  isUserMessage: boolean
  username: string | null
}

type Props = {
  userMessages: Message[]
  userRecipient: Profile
  userProfile: Profile
}

export default function Conversation({
  userMessages,
  userRecipient,
  userProfile,
}: Props) {
  const { session, supabase } = useSupabase()
  const path = usePathname()

  const chatId = path.split('/').pop()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<MessageDisplay[]>([])

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!message) return

    const messageToSend = {
      // TODO: check the chatId not to create multiple chats for the same users
      chat_id: chatId,
      from_user: userProfile.id,
      to_user: userRecipient.id,
      content: message,
    }
    const { error } = await supabase
      .from('messages')
      .insert([messageToSend])
      .single()

    if (error) {
      console.log('error:', error)
      // TODO: show an error
    } else {
      setMessages([
        ...messages,
        {
          id: 0,
          content: messageToSend.content,
          timestamp: Date.now().toString(),
          isUserMessage: true,
          username: userProfile.username,
        },
      ])
    }

    setMessage('')
  }

  // TODO: extract this outside
  useEffect(() => {
    const previousMessages = userMessages
      .filter(message => {
        return (
          (message.from_user == session?.user.id &&
            message.to_user == userRecipient.id) ||
          (message.from_user == userRecipient.id &&
            message.to_user == session?.user.id)
        )
      })
      .map(message => {
        // TODO: data normalization (new types? service folder/file?)
        return {
          id: message.id,
          content: message.content,
          timestamp: message.timestamp,
          isUserMessage: message.from_user == session?.user.id,
          username:
            message.from_user == session?.user.id
              ? userProfile?.username
              : userRecipient?.username,
        }
      })
    setMessages(previousMessages)
  }, [session?.user, userMessages, userRecipient, userProfile])

  useEffect(() => {
    const channel = supabase.channel('messages').on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `to_user = eq.${userRecipient.id}`,
      },
      payload => {
        console.log('Message from channel:', payload.new)
        const newMessage = payload.new
        setMessages((messages: MessageDisplay[]) => {
          return [
            ...messages,
            {
              id: newMessage.id,
              content: newMessage.content,
              timestamp: newMessage.timestamp,
              isUserMessage: newMessage.from_user == session?.user.id,
              username:
                newMessage.from_user == session?.user.id
                  ? userProfile?.username
                  : userRecipient?.username,
            },
          ]
        })
      },
    )
    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  return (
    <div className={css({ border: '1px solid red' })}>
      <ul>
        {messages.map(message => {
          return (
            <Message
              key={message.id}
              isOwnMessage={message.isUserMessage}
              username={message.username}
              timestamp={message.timestamp}
              content={message.content}
            />
          )
        })}
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
