import { SwyzeSidebar } from '@/components/swyze/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Mock user data - in real app this would come from auth
const mockUser = {
  name: 'Valentina',
  email: 'valentina@example.com',
  avatar: '/avatars/user.jpg',
  plan: 'Creator Pro',
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
