import { css } from '../../styled-system/css'
import useAvatar from './useAvatar'

type Props = {
  isOwnMessage: boolean
  username: string
  timestamp: string
  content: string
  avatarUrl: string
}

export default function Message(props: Props) {
  const { AvatarPreview } = useAvatar({ avatarUrl: props.avatarUrl, size: 60 })
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: props.isOwnMessage ? 'end' : 'start',
      })}
    >
      {props.isOwnMessage ? null : (
        <AvatarPreview className={css({ borderRadius: '50%' })} />
      )}
      <div
        className={css({
          bg: props.isOwnMessage ? 'teal.400' : 'teal.200',
          p: 2,
          borderRadius: props.isOwnMessage
            ? '10px 0px 10px 10px'
            : '0px 0px 10px 10px',
        })}
      >
        {props.username} {props.isOwnMessage ? '(you)' : ''}: {props.content}
      </div>
    </div>
  )
}
