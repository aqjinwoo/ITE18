'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { EventDetailsPage } from '../../../components/EventDetailsPage'
import { useAuth } from '../../../contexts/AuthContext'
import { eventsApi, Event } from '../../../services/api'

export default function EventDetails() {
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

  const navigateTo = (page: string, event?: any) => {
    if (page === 'ticket-purchase' && event) {
      router.push(`/events/${event.id}/purchase`)
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
    <EventDetailsPage 
      event={event as any}
      user={user}
      onNavigate={navigateTo}
      onLogout={handleLogout}
    />
  )
}

