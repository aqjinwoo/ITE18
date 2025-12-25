'use client'

import { useRouter } from 'next/navigation'
import { LandingPage } from '../landing/LandingPage'

export default function Home() {
  const router = useRouter()

  return (
    <LandingPage 
      onNavigateToLogin={() => router.push('/login')}
      onNavigateToRegister={() => router.push('/register')}
    />
  )
}

