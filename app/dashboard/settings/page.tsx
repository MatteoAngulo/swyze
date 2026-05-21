'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'

export default function AccountSettingsPage() {
  const [avatar] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200')

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold italic text-foreground">
          Configuración de cuenta
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your personal profile, preferences, and security settings.
        </p>
      </div>

      {/* Personal Profile Section */}
      <section className="rounded-2xl border border-border bg-surface-1 p-6 mb-6">
        <div className="flex gap-8">
          <div className="w-1/3">
            <h2 className="font-heading text-2xl font-bold text-foreground">Personal Profile</h2>
            <p className="mt-2 text-muted-foreground">
              Update your photo and personal details.
            </p>
          </div>
          
          <div className="flex-1 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl overflow-hidden bg-surface-2">
                  <Image
                    src={avatar}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <Button variant="outline" className="border-border bg-surface-2 text-foreground hover:bg-surface-3">
                <Camera className="mr-2 h-4 w-4" />
                Change Avatar
              </Button>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
              </Label>
              <Input
                defaultValue="Sarah Jenkins"
                className="h-12 border-border bg-surface-2 text-foreground"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <Input
                type="email"
                defaultValue="sarah@example.com"
                className="h-12 border-border bg-surface-2 text-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="rounded-2xl border border-border bg-surface-1 p-6 mb-6">
        <div className="flex gap-8">
          <div className="w-1/3">
            <h2 className="font-heading text-2xl font-bold text-foreground">Preferences</h2>
            <p className="mt-2 text-muted-foreground">
              Customize your workspace experience.
            </p>
          </div>
          
          <div className="flex-1">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Language */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Language
                </Label>
                <Select defaultValue="es">
                  <SelectTrigger className="h-12 border-border bg-surface-2 text-foreground">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Default Platform */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Default Platform
                </Label>
                <Select defaultValue="instagram">
                  <SelectTrigger className="h-12 border-border bg-surface-2 text-foreground">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="rounded-2xl border border-border bg-surface-1 p-6 mb-6">
        <div className="flex gap-8">
          <div className="w-1/3">
            <h2 className="font-heading text-2xl font-bold text-foreground">Security</h2>
            <p className="mt-2 text-muted-foreground">
              Manage your password and authentication.
            </p>
          </div>
          
          <div className="flex-1 space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Password
              </Label>
              <Input
                type="password"
                defaultValue="••••••••"
                className="h-12 border-border bg-surface-2 text-foreground"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* New Password */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  New Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-border bg-surface-2 text-foreground"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-border bg-surface-2 text-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button className="bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover px-8">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
