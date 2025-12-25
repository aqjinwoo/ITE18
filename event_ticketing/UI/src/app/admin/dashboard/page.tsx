'use client'

import { useRouter } from 'next/navigation'
import { AdminDashboard } from '../../../components/AdminDashboard'
import { useAuth } from '../../../contexts/AuthContext'
import { useEffect } from 'react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login')
    }
  }, [user, router])

  if (!user || user.role !== 'admin') return null

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
    <AdminDashboard 
      user={user}
      onNavigate={navigateTo}
      onLogout={handleLogout}
    />
  )
}

