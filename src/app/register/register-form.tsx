'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { redirect } from 'next/navigation'
import Button from '@/components/common/Button'
import { css } from '../../../styled-system/css'
import Input from '@/components/common/Input'
import useToast from '@/hooks/useToast'

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const { toastMessage, toggleToast } = useToast()

  const { email, username, password, confirmPassword } = formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords don't match")
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })
      if (error) {
        toggleToast(error.message)
      }
    }
  }

  if (session) {
    return redirect('/messages')
  }

  return (
    <div
      className={css({
        h: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDir: 'column',
        minW: '320px',
        w: '50%',
        m: '0 auto',
      })}
    >
      <h2 className={css({ fontSize: '2xl', mb: 2 })}>Register</h2>
      <form onSubmit={handleSubmit} className={css({ width: '100%' })}>
        <label>
          Username
          <Input
            fullWidth
            userCss={css({ mb: 2 })}
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </label>
        <label>
          Email
          <Input
            fullWidth
            userCss={css({ mb: 2 })}
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password
          <Input
            fullWidth
            userCss={css({ mb: 2 })}
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </label>
        <label>
          Confirm Password
          <Input
            fullWidth
            userCss={css({ mb: 2 })}
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
        </label>
        <Button userCss={css({ width: '100%', my: 4 })} size="md" type="submit">
          Register
        </Button>
      </form>
      <p className={css({ fontSize: 'sm' })}>
        Already have an account? <Link href="/">Sign in</Link>
      </p>
    </div>
  )
}
