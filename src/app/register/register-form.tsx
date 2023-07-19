'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Button from '@/components/common/Button'
import { css } from '../../../styled-system/css'
import Input from '@/components/common/Input'
import ErrorMessage from '@/components/common/ErrorMessage'
import { useSupabase } from '@/components/SupabaseProvider'

export default function AccountForm() {
  const { supabase, session } = useSupabase()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errorMessage, setErrorMessage] = useState<string>()
  const { email, username, password, confirmPassword } = formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
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
        setErrorMessage(error.message)
      }
    }
  }

  console.log('register form...', session)

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
        <ErrorMessage>{errorMessage}</ErrorMessage>
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
