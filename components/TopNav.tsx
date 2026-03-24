'use client'

import { Bell, Search } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { getGreeting } from '@/lib/utils'

interface TopNavProps {
  title?: string
  subtitle?: string
  showGreeting?: boolean
}

export default function TopNav({ title, subtitle, showGreeting = false }: TopNavProps) {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'Teacher'

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          {showGreeting ? (
            <>
              <h2 className="text-xl font-bold text-slate-800">
                {getGreeting(userName)}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {subtitle || "Here's your class overview for today."}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-800">{title}</h2>
              {subtitle && (
                <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  )
}
