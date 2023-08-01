import { css } from '../../styled-system/css'

// TODO: this | null thing is getting annoying, is there a way to normalize my types?
type Props = {
  isOwnMessage: boolean
  username: string | null
  timestamp: string | null
  content: string | null
}

export default function Message(props: Props) {
  return (
    <div className={css({})}>
      {props.username}: {props.content}
    </div>
  )
}
