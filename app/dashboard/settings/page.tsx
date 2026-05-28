'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Camera, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { getProfile, updateProfile, uploadAvatar, type Profile } from '@/lib/supabase/profiles'

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [instagram, setInstagram] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) { setLoading(false); return }
        getProfile(user.id).then(p => {
          if (p) {
            setProfile(p)
            setDisplayName(p.display_name || '')
            setInstagram(p.instagram_handle || '')
            setLinkedin(p.linkedin_handle || '')
            setTiktok(p.tiktok_handle || '')
            setAvatarUrl(p.avatar_url || '')
          }
          setLoading(false)
        })
      })
    } catch { setLoading(false) }
  }, [])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    try {
      const updated = await updateProfile(profile.id, {
        display_name: displayName,
        instagram_handle: instagram || null,
        linkedin_handle: linkedin || null,
        tiktok_handle: tiktok || null,
      })
      setProfile(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return
    setUploadingAvatar(true)
    try {
      const url = await uploadAvatar(profile.id, file)
      await updateProfile(profile.id, { avatar_url: url })
      setAvatarUrl(url)
    } catch (e) {
      console.error(e)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordError('')
    if (!newPassword || newPassword.length < 6) { setPasswordError('Minimo 6 caracteres'); return }
    if (newPassword !== confirmPassword) { setPasswordError('Las contrasenas no coinciden'); return }
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) { setPasswordError(error.message); return }
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSaved(true)
      setTimeout(() => setPasswordSaved(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold italic text-foreground">Configuracion de cuenta</h1>
        <p className="mt-2 text-muted-foreground">Administra tu perfil, redes sociales y seguridad.</p>
      </div>

      {/* Personal Profile */}
      <section className="rounded-2xl border border-border bg-surface-1 p-6 mb-6">
        <div className="flex gap-8">
          <div className="w-1/3">
            <h2 className="font-heading text-2xl font-bold text-foreground">Perfil</h2>
            <p className="mt-2 text-muted-foreground">Tu foto y datos personales.</p>
          </div>
          <div className="flex-1 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-surface-2">
                {uploadingAvatar ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" width={96} height={96} className="h-full w-full object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-cyan/20 text-2xl font-bold text-cyan">
                    {displayName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="border-border bg-surface-2 text-foreground hover:bg-surface-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {uploadingAvatar ? 'Subiendo...' : 'Cambiar foto'}
                </Button>
                <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP · Max 2MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-12 border-border bg-surface-2 text-foreground"
              />
            </div>

            {/* Social handles */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Instagram', value: instagram, set: setInstagram, placeholder: '@tuusuario' },
                { label: 'LinkedIn', value: linkedin, set: setLinkedin, placeholder: 'linkedin.com/in/tu' },
                { label: 'TikTok', value: tiktok, set: setTiktok, placeholder: '@tuusuario' },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label} className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
                  <Input
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    placeholder={placeholder}
                    className="h-12 border-border bg-surface-2 text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="rounded-2xl border border-border bg-surface-1 p-6 mb-6">
        <div className="flex gap-8">
          <div className="w-1/3">
            <h2 className="font-heading text-2xl font-bold text-foreground">Seguridad</h2>
            <p className="mt-2 text-muted-foreground">Cambia tu contrasena.</p>
          </div>
          <div className="flex-1 space-y-4">
            {passwordError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
                <p className="text-sm text-red-400">{passwordError}</p>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nueva contrasena</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordError('') }}
                  className="h-12 border-border bg-surface-2 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirmar contrasena</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError('') }}
                  className="h-12 border-border bg-surface-2 text-foreground"
                />
              </div>
            </div>
            <Button
              onClick={handlePasswordChange}
              variant="outline"
              className="border-border bg-surface-2 text-foreground hover:bg-surface-1"
            >
              {passwordSaved ? <><Check className="mr-2 h-4 w-4 text-cyan" />Guardado</> : 'Cambiar contrasena'}
            </Button>
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button onClick={handleSave} disabled={saving} className="bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover px-8">
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : saved ? <><Check className="mr-2 h-4 w-4" />Guardado</> : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
