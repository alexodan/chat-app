'use client'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { css } from '../../../styled-system/css'

export default function Loading() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDir: 'column',
        justifyContent: 'center',
        margin: 4,
      })}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={css({ display: 'flex', mb: 2 })}>
          <Skeleton
            circle={true}
            width={40}
            height={40}
            className={css({ flex: 1, mr: 4 })}
          />
          <Skeleton
            className={css({
              mb: 2,
              flex: 1,
            })}
            baseColor="#e2e8f0c2"
            height={40}
            width={240}
          />
        </div>
      ))}
    </div>
  )
}
