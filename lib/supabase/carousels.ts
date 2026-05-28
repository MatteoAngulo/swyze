import { createClient } from './client'

export interface CarouselRecord {
  id: string
  user_id: string
  title: string
  slides: Array<{
    id: number
    headline: string
    body: string
    icon: string
    layout: string
  }>
  brand_kit: {
    primary: string
    secondary: string
    accent: string
    font: string
  } | null
  platform: string | null
  format: string | null
  created_at: string
  updated_at: string
}

export async function saveCarousel(
  userId: string,
  title: string,
  slides: CarouselRecord['slides'],
  brandKit: CarouselRecord['brand_kit'],
  platform: string,
  format: string
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('carousels')
    .insert({
      user_id: userId,
      title,
      slides,
      brand_kit: brandKit,
      platform,
      format,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserCarousels(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('carousels')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as CarouselRecord[]
}

export async function getCarousel(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('carousels')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as CarouselRecord
}

export async function updateCarousel(
  id: string,
  updates: Partial<Pick<CarouselRecord, 'title' | 'slides' | 'brand_kit' | 'platform' | 'format'>>
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('carousels')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCarousel(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('carousels')
    .delete()
    .eq('id', id)

  if (error) throw error
}
