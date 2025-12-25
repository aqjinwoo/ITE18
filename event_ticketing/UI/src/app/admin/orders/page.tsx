'use client'

import { useRouter } from 'next/navigation'
import { OrdersPage } from '../../../components/OrdersPage'
import { useAuth } from '../../../contexts/AuthContext'
import { useEffect } from 'react'

export default function Orders() {
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }
  }, [user, router])

  if (!user || user.role !== 'admin') {
    return null
  }

  const navigateTo = (page: string) => {
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
    
    const route = routeMap[page];
    if (route) {
      router.push(route)
    } else {
      router.push(`/${page}`)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <OrdersPage 
      user={user}
      onNavigate={navigateTo}
      onLogout={handleLogout}
    />
  )
}
