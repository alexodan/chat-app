import { css, cx } from '../../../styled-system/css'

export default function Separator(props: { text: string; userCss?: string }) {
  return (
    <div
      className={cx(
        props.userCss,
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
