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
  userCss?: string // TODO: does this make sense
} & InputHTMLAttributes<HTMLInputElement>

export default function Input({
  size,
  visual,
  fullWidth,
  userCss,
  ...rest
}: Props) {
  return (
    <input
      className={cx(
        input({ size, visual }),
        fullWidth ? css({ width: '100%' }) : '',
        userCss ?? '',
      )}
      {...rest}
    />
  )
}
