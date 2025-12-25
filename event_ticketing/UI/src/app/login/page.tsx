'use client'

import { useRouter } from 'next/navigation'
import { LoginPage } from '../../components/LoginPage'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect } from 'react'

export default function Login() {
  const router = useRouter()
  const { user, login } = useAuth()

  useEffect(() => {
    if (user) {
      // Navigate based on user role
      const destination = user.role === 'admin' ? '/admin/dashboard' : '/events'
      router.push(destination)
    }
  }, [user, router])

  const handleLogin = async (email: string, password: string, isAdmin: boolean) => {
    try {
      await login(email, password, isAdmin)
      // Navigation will be handled by useEffect when user state updates
    } catch (error) {
      // Error is already handled in LoginPage component
      throw error
    }
  }

  return (
    <LoginPage 
      onLogin={handleLogin}
      onNavigateToRegister={() => router.push('/register')}
      onBack={() => router.push('/')}
    />
  )
}

