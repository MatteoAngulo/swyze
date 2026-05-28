'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SwyzeSidebar } from '@/components/swyze/sidebar'
import { createClient } from '@/lib/supabase/client'
import { getProfile } from '@/lib/supabase/profiles'
import { Loader2 } from 'lucide-react'

interface UserData {
  name: string
  email: string
  avatar?: string
  plan: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
        if (authUser) {
          const profile = await getProfile(authUser.id)
          setUser({
            name: profile?.display_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuario',
            email: authUser.email || '',
            avatar: profile?.avatar_url || authUser.user_metadata?.avatar_url,
            plan: profile?.plan === 'pro' ? 'Creator Pro' : 'Free',
          })
        }
        setLoading(false)
      })
    } catch {
      setUser({ name: 'Demo User', email: 'demo@swyze.ai', plan: 'Free' })
      setLoading(false)
    }
  }, [])

  const isEditorPage = pathname.startsWith('/dashboard/editor/')

  if (isEditorPage) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SwyzeSidebar user={user || undefined} />
      <main className="pl-[280px]">
        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
