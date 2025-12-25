'use client'

import { Ticket } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-5 h-5', container: 'w-8 h-8', text: 'text-xl' },
    md: { icon: 'w-6 h-6', container: 'w-10 h-10', text: 'text-2xl' },
    lg: { icon: 'w-7 h-7', container: 'w-12 h-12', text: 'text-3xl' }
  }

  const sizeConfig = sizes[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeConfig.container} bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/50`}>
        <Ticket className={`${sizeConfig.icon} text-primary-foreground`} />
      </div>
      {showText && (
        <span className={`${sizeConfig.text} tracking-tight font-semibold`}>Tixaro</span>
      )}
    </div>
  )
}

