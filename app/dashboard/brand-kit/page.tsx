'use client'

import { useState } from 'react'
import { 
  Search, 
  Plus, 
  Check, 
  Image as ImageIcon, 
  Palette, 
  Type, 
  Smartphone, 
  Monitor,
  Upload,
  Crown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const brands = [
  { id: 1, name: 'Swyze Official', initials: 'SW', updatedAt: '2 days ago', isActive: true },
  { id: 2, name: 'Project Alpha', initials: 'PA', updatedAt: '', isActive: false, isDraft: true },
]

const defaultColors = {
  primary: '#00D4FF',
  secondary: '#1C1B1B',
  accent: '#FFD9A1',
}

export default function BrandKitPage() {
  const [activeBrand, setActiveBrand] = useState(brands[0])
  const [colors, setColors] = useState(defaultColors)
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')

  return (
    <div className="flex gap-8">
      {/* Brands List */}
      <div className="w-64 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Your Brands</h2>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search brands..."
            className="h-10 pl-10 border-border bg-surface-1 text-foreground placeholder:text-muted-foreground text-sm"
          />
        </div>

        {/* Brands */}
        <div className="space-y-2">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setActiveBrand(brand)}
              className={cn(
                'w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors',
                activeBrand.id === brand.id
                  ? 'bg-surface-1 border border-cyan/30'
                  : 'hover:bg-surface-1/50'
              )}
            >
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold',
                brand.isActive ? 'bg-cyan text-primary-foreground' : 'bg-surface-2 text-muted-foreground'
              )}>
                {brand.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{brand.name}</p>
                <p className="text-xs text-muted-foreground">
                  {brand.isDraft ? 'Draft' : `Updated ${brand.updatedAt}`}
                </p>
              </div>
              {activeBrand.id === brand.id && (
                <Check className="h-4 w-4 text-cyan shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Pro Limit Card */}
        <div className="mt-8 rounded-xl border border-border bg-surface-1 p-4">
          <div className="flex items-center gap-2 text-amber">
            <Crown className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Pro Limit</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Upgrade to Pro for unlimited brand profiles and custom font uploads.
          </p>
          <Button className="mt-4 w-full border-border bg-surface-2 text-foreground hover:bg-surface-3" variant="outline">
            Upgrade Now
          </Button>
        </div>
      </div>

      {/* Brand Editor */}
      <div className="flex-1">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Editing Profile
          </p>
          <h1 className="font-heading text-3xl font-bold text-foreground">{activeBrand.name}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="space-y-8">
            {/* Brand Logo */}
            <section className="rounded-xl border border-border bg-surface-1 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-cyan" />
                <h3 className="font-heading text-lg font-semibold text-foreground">Brand Logo</h3>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-2 p-8">
                <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="font-medium text-foreground">Drag & drop your logo here</p>
                <p className="text-sm text-muted-foreground">Supports SVG, PNG, JPG (Max 5MB)</p>
              </div>
            </section>

            {/* Color Palette */}
            <section className="rounded-xl border border-border bg-surface-1 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-cyan" />
                <h3 className="font-heading text-lg font-semibold text-foreground">Color Palette</h3>
              </div>
              <div className="space-y-4">
                {/* Primary */}
                <div className="flex items-center gap-4 rounded-lg bg-surface-2 p-3">
                  <div 
                    className="h-10 w-10 rounded-lg shrink-0" 
                    style={{ backgroundColor: colors.primary }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Primary Color</p>
                    <p className="text-xs text-muted-foreground">Main CTAs, Highlights</p>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-surface-3 px-2 py-1">
                    <span className="text-xs text-muted-foreground">#</span>
                    <Input
                      value={colors.primary.replace('#', '')}
                      onChange={(e) => setColors({ ...colors, primary: `#${e.target.value}` })}
                      className="h-auto w-20 border-none bg-transparent p-0 text-sm font-mono text-foreground"
                    />
                  </div>
                </div>

                {/* Secondary */}
                <div className="flex items-center gap-4 rounded-lg bg-surface-2 p-3">
                  <div 
                    className="h-10 w-10 rounded-lg shrink-0" 
                    style={{ backgroundColor: colors.secondary }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Secondary Color</p>
                    <p className="text-xs text-muted-foreground">Surfaces, Secondary Actions</p>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-surface-3 px-2 py-1">
                    <span className="text-xs text-muted-foreground">#</span>
                    <Input
                      value={colors.secondary.replace('#', '')}
                      onChange={(e) => setColors({ ...colors, secondary: `#${e.target.value}` })}
                      className="h-auto w-20 border-none bg-transparent p-0 text-sm font-mono text-foreground"
                    />
                  </div>
                </div>

                {/* Accent */}
                <div className="flex items-center gap-4 rounded-lg bg-surface-2 p-3">
                  <div 
                    className="h-10 w-10 rounded-lg shrink-0" 
                    style={{ backgroundColor: colors.accent }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Accent Color</p>
                    <p className="text-xs text-muted-foreground">Warnings, Badges, Chips</p>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-surface-3 px-2 py-1">
                    <span className="text-xs text-muted-foreground">#</span>
                    <Input
                      value={colors.accent.replace('#', '')}
                      onChange={(e) => setColors({ ...colors, accent: `#${e.target.value}` })}
                      className="h-auto w-20 border-none bg-transparent p-0 text-sm font-mono text-foreground"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Typography */}
            <section className="rounded-xl border border-border bg-surface-1 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Type className="h-5 w-5 text-cyan" />
                <h3 className="font-heading text-lg font-semibold text-foreground">Typography</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Font selection coming soon. Currently using Sora for headings and Plus Jakarta Sans for body text.
              </p>
            </section>
          </div>

          {/* Live Preview */}
          <div>
            <div className="sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Live Preview
                  </span>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-1 p-1">
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={cn(
                      'rounded-md p-2 transition-colors',
                      previewMode === 'mobile' ? 'bg-surface-2 text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={cn(
                      'rounded-md p-2 transition-colors',
                      previewMode === 'desktop' ? 'bg-surface-2 text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Preview Card */}
              <div className="rounded-2xl border border-border bg-surface-1 p-4">
                <div 
                  className="aspect-[4/5] rounded-xl p-6 flex flex-col"
                  style={{ backgroundColor: colors.primary }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-sm font-bold text-white">
                      SW
                    </div>
                    <span className="text-xs text-white/60">01/05</span>
                  </div>
                  <div className="flex-1 flex items-end">
                    <div 
                      className="rounded-md px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: colors.accent, color: colors.secondary }}
                    >
                      NEW FEATURE
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Changes are reflected in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
