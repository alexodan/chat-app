import React from 'react'
import { css } from '../../../styled-system/css'

export default function ErrorMessage({
  children,
}: {
  children: React.ReactNode
}) {
  if (!children) {
    return null
  }
  return (
    <div
      className={css({
        color: 'red.500',
      })}
    >
      {children}
    </div>
  )
}
