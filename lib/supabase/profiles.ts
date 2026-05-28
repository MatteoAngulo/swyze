import { createClient } from './client'

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  instagram_handle: string | null
  linkedin_handle: string | null
  tiktok_handle: string | null
  plan: string
  tokens_used: number
  tokens_limit: number
  created_at: string
  updated_at: string
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data as Profile
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'display_name' | 'avatar_url' | 'instagram_handle' | 'linkedin_handle' | 'tiktok_handle'>>
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return `${data.publicUrl}?t=${Date.now()}`
}
