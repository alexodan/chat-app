import { css } from '../../../styled-system/css'

type Props = {
  message: string
}

export default function Toast({ message }: Props) {
  return (
    <div
      className={css({
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bg: 'red',
        color: 'white',
        p: 3,
      })}
    >
      {message}
    </div>
  )
}
