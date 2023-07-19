import { css } from '../../styled-system/css'
import Link from 'next/link'

export default async function LandingPage() {
  return (
    <div
      className={css({
        h: '100vh',
      })}
    >
      <h1>Landing</h1>
      <Link href="/login">Login</Link>
    </div>
  )
}
