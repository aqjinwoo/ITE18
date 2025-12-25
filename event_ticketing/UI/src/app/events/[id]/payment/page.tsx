'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PaymentPage } from '../../../../components/PaymentPage'
import { useAuth } from '../../../../contexts/AuthContext'
import { eventsApi, Event } from '../../../../services/api'

export default function Payment() {
  const router = useRouter()
  const params = useParams()
  const { user, logout } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const loadEvent = async () => {
      try {
        const eventId = parseInt(params.id as string)
        const eventData = await eventsApi.getEvent(eventId)
        setEvent(eventData as Event)
      } catch (error) {
        console.error('Error loading event:', error)
        router.push('/events')
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [params.id, user, router])

  if (!user || loading) return null
  if (!event) return null

  const navigateTo = (page: string) => {
    if (page === 'user-dashboard') {
      router.push('/dashboard')
    } else if (page === 'events') {
      router.push('/events')
    } else {
      router.push(`/${page}`)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <PaymentPage 
      event={event as any}
      user={user}
      onNavigate={navigateTo}
      onLogout={handleLogout}
    />
  )
}

