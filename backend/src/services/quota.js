import { createClient } from '@supabase/supabase-js'

const DAILY_LIMIT = 3

let supabase = null

function getSupabase() {
  if (!supabase && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )
  }
  return supabase
}

// In-memory fallback for development
const memoryQuota = new Map()

function getToday() {
  return new Date().toISOString().split('T')[0]
}

export async function checkQuota(userId) {
  const client = getSupabase()
  
  if (!client) {
    // Fallback to in-memory for development
    const key = `${userId}-${getToday()}`
    const used = memoryQuota.get(key) || 0
    const remaining = Math.max(0, DAILY_LIMIT - used)
    return { allowed: remaining > 0, remaining }
  }

  try {
    const today = getToday()
    
    const { data, error } = await client
      .from('user_quota')
      .select('generations_used')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    const used = data?.generations_used || 0
    const remaining = Math.max(0, DAILY_LIMIT - used)
    
    return { allowed: remaining > 0, remaining }
  } catch (error) {
    console.error('Quota check error:', error)
    return { allowed: true, remaining: DAILY_LIMIT }
  }
}

export async function decrementQuota(userId) {
  const client = getSupabase()
  
  if (!client) {
    // Fallback to in-memory for development
    const key = `${userId}-${getToday()}`
    const used = memoryQuota.get(key) || 0
    memoryQuota.set(key, used + 1)
    return
  }

  try {
    const today = getToday()
    
    const { data: existing } = await client
      .from('user_quota')
      .select('id, generations_used')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (existing) {
      await client
        .from('user_quota')
        .update({ generations_used: existing.generations_used + 1 })
        .eq('id', existing.id)
    } else {
      await client
        .from('user_quota')
        .insert({ user_id: userId, date: today, generations_used: 1 })
    }
  } catch (error) {
    console.error('Quota decrement error:', error)
  }
}
