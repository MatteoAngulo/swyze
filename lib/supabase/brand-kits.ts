import { createClient } from './client'

export interface BrandKit {
  id: string
  user_id: string
  name: string
  primary_color: string
  secondary_color: string
  accent_color: string
  font: string
  is_default: boolean
  created_at: string
}

export async function getBrandKits(userId: string): Promise<BrandKit[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('brand_kits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data as BrandKit[]
}

export async function createBrandKit(
  userId: string,
  kit: Omit<BrandKit, 'id' | 'user_id' | 'created_at'>
): Promise<BrandKit> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('brand_kits')
    .insert({ ...kit, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data as BrandKit
}

export async function updateBrandKit(
  id: string,
  updates: Partial<Omit<BrandKit, 'id' | 'user_id' | 'created_at'>>
): Promise<BrandKit> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('brand_kits')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as BrandKit
}

export async function deleteBrandKit(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('brand_kits').delete().eq('id', id)
  if (error) throw error
}

export async function setDefaultBrandKit(userId: string, kitId: string): Promise<void> {
  const supabase = createClient()
  await supabase.from('brand_kits').update({ is_default: false }).eq('user_id', userId)
  await supabase.from('brand_kits').update({ is_default: true }).eq('id', kitId)
}
