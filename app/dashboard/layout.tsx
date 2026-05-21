'use client'

import { usePathname } from 'next/navigation'
import { SwyzeSidebar } from '@/components/swyze/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Mock user data - in real app this would come from auth
const mockUser = {
  name: 'Valentina',
  email: 'valentina@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  plan: 'Creator Pro',
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  
  // Hide sidebar on editor pages - they have their own full-screen layout
  const isEditorPage = pathname.startsWith('/dashboard/editor/')
  
  if (isEditorPage) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SwyzeSidebar user={mockUser} />
      <main className="pl-[280px]">
        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
