'use client'

import { useRouter } from 'next/navigation'
import { EventsPage } from '../../components/EventsPage'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect } from 'react'

export default function Events() {
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) return null

  const navigateTo = (page: string, event?: any) => {
    const routeMap: { [key: string]: string } = {
      'admin-dashboard': '/admin/dashboard',
      'user-dashboard': '/dashboard',
      'events': '/events',
      'create-event': '/admin/events/create',
      'orders': '/admin/orders',
      'venues': '/admin/venues',
      'categories': '/admin/categories',
      'settings': '/settings',
    };
    
    if (page === 'event-details' && event) {
      router.push(`/events/${event.id}`)
    } else {
      const route = routeMap[page];
      if (route) {
        router.push(route)
      } else {
        router.push(`/${page}`)
      }
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <EventsPage 
      user={user}
      onNavigate={navigateTo}
      onLogout={handleLogout}
    />
  )
}

