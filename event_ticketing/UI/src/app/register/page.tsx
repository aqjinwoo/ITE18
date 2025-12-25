'use client'

import { useRouter } from 'next/navigation'
import { RegisterPage } from '../../components/RegisterPage'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect } from 'react'

export default function Register() {
  const router = useRouter()
  const { user, register } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/events')
    }
  }, [user, router])

  const handleRegister = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      await register(name, email, password, confirmPassword)
      // Redirect immediately after successful registration
      router.push('/events')
    } catch (error) {
      // Error is handled in RegisterPage component
      throw error
    }
  }

  return (
    <RegisterPage 
      onRegister={handleRegister}
      onNavigateToLogin={() => router.push('/login')}
      onBack={() => router.push('/')}
    />
  )
}

