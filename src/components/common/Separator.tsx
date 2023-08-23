import { css, cx } from '../../../styled-system/css'

type Props = {
  text: string
} & React.HTMLAttributes<HTMLDivElement>

export default function Separator(props: Props) {
  return (
    <div
      className={cx(
        props.className,
        css({ display: 'flex', alignItems: 'center' }),
      )}
    >
      <div
        className={css({ flexGrow: 1, borderBottom: '1px solid black' })}
      ></div>
      <span
        className={css({
          padding: '0 0.5rem',
          backgroundColor: 'white',
          color: 'black',
        })}
      >
        {props.text}
      </span>
      <div
        className={css({ flexGrow: 1, borderBottom: '1px solid black' })}
      ></div>
    </div>
  )
}
