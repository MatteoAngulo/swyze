'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FolderOpen, 
  LayoutGrid, 
  Palette, 
  Users, 
  Settings, 
  HelpCircle,
  Plus,
  Sparkles,
  CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SwyzeSidebarProps {
  user?: {
    name: string
    email?: string
    avatar?: string
    plan?: string
  }
}

const mainNavItems = [
  { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
  { href: '/dashboard/templates', label: 'Templates', icon: LayoutGrid },
  { href: '/dashboard/brand-kit', label: 'Brand Kit', icon: Palette },
  { href: '/dashboard/referrals', label: 'Invitar colegas', icon: Users },
]

const bottomNavItems = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/help', label: 'Help', icon: HelpCircle },
]

export function SwyzeSidebar({ user }: SwyzeSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[280px] flex-col border-r border-border bg-surface-0">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-1">
          <Sparkles className="h-5 w-5 text-cyan" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Swyze</h1>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {user?.plan || 'Creator Pro'}
          </p>
        </div>
        {user?.avatar && (
          <Avatar className="ml-auto h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* New Carousel Button */}
      <div className="px-4 pb-4">
        <Link
          href="/dashboard"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan py-3 font-semibold text-primary-foreground transition-all glow-cyan-hover hover:bg-cyan/90"
        >
          <Plus className="h-5 w-5" />
          <span>New Carousel</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-surface-1 text-foreground'
                  : 'text-muted-foreground hover:bg-surface-1/50 hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-border p-3">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-surface-1 text-foreground'
                  : 'text-muted-foreground hover:bg-surface-1/50 hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* User Profile */}
        {user && (
          <Link
            href="/dashboard/settings/account"
            className="mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-1/50 hover:text-foreground"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-cyan text-primary-foreground text-xs">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.plan || 'Creator Pro'}</p>
            </div>
          </Link>
        )}
      </div>
    </aside>
  )
}
