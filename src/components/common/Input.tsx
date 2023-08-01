import { css, cva, cx } from '../../../styled-system/css'
import { InputHTMLAttributes } from 'react'

export const input = cva({
  base: {
    display: 'flex',
    borderWidth: '1px',
    borderColor: 'gray.200',
    borderRadius: 'md',
    padding: '2',
    fontSize: '16px',
    color: 'black',
  },
  variants: {
    visual: {
      solid: { bg: 'gray.100' },
      outline: { bg: 'white' },
    },
    size: {
      sm: { padding: '2', fontSize: '12px' },
      lg: { padding: '4', fontSize: '24px' },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
  defaultVariants: {
    visual: 'outline',
    size: 'sm',
  },
})

type Props = {
  size?: 'sm' | 'lg'
  visual?: 'outline' | 'solid'
  fullWidth?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export default function Input({
  size,
  visual,
  fullWidth,
  className,
  disabled,
  ...rest
}: Props) {
  return (
    <input
      disabled={disabled}
      // https://panda-css.com/docs/concepts/writing-styles#merging
      className={cx(
        input({ size, visual, disabled }),
        fullWidth ? css({ width: '100%' }) : '',
        className,
      )}
      {...rest}
    />
  )
}
