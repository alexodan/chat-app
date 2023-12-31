import { css, cva, cx } from '../../../styled-system/css'
import Loading from '@/components/common/Loading'

export const button = cva({
  base: {
    borderRadius: 'md',
    display: 'flex',
    cursor: 'pointer',
    justifyContent: 'center',
  },
  variants: {
    visual: {
      solid: { bg: 'teal.400', color: 'white' },
      outline: { borderWidth: '1px', borderColor: 'teal.400' },
    },
    size: {
      sm: { padding: '2', fontSize: '12px' },
      md: { py: '1', px: '2', fontSize: '16px' },
      lg: { padding: '4', fontSize: '24px' },
    },
  },
  defaultVariants: {
    visual: 'solid',
    size: 'sm',
  },
})

type Props = {
  size?: 'sm' | 'md' | 'lg'
  visual?: 'solid' | 'outline'
  isLoading?: boolean
  fullWidth?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
  children,
  size,
  visual,
  isLoading,
  fullWidth,
  className,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      className={cx(
        button({ visual, size }),
        fullWidth ? css({ width: '100%' }) : '',
        className ?? '',
      )}
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading ? <Loading height={10} width={10} /> : children}
    </button>
  )
}
