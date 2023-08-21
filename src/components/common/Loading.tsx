import { css } from '../../../styled-system/css'
import Image from 'next/image'

type Props = {
  height: number
  width: number
}

export default function Loading(props: Props) {
  return (
    <Image
      className={css({
        animation: 'spin 3s linear infinite',
      })}
      src="/spinner.svg"
      width={props.width}
      height={props.height}
      alt="Loading"
    />
  )
}
