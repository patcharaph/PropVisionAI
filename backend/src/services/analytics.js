import { createClient } from '@supabase/supabase-js'

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
const memoryEvents = []
const memoryGenerations = []

// Event types
export const EVENT_TYPES = {
  UPLOAD: 'upload',
  GENERATE_START: 'generate_start',
  GENERATE_SUCCESS: 'generate_success',
  GENERATE_FAIL: 'generate_fail',
  GENERATE_TIMEOUT: 'generate_timeout',
  SHARE: 'share',
  FEEDBACK: 'feedback',
}

/**
 * Track a conversion event
 */
export async function trackEvent(eventType, metadata = {}) {
  const event = {
    event_type: eventType,
    metadata,
    created_at: new Date().toISOString(),
    user_id: metadata.userId || 'anonymous',
  }

  const client = getSupabase()
  
  if (!client) {
    memoryEvents.push(event)
    console.log(`[Analytics] ${eventType}`, metadata)
    return
  }

  try {
    await client.from('analytics_events').insert(event)
  } catch (error) {
    console.error('Failed to track event:', error)
    memoryEvents.push(event) // Fallback to memory
  }
}

/**
 * Log generation metrics
 */
export async function logGeneration({
  userId,
  roomSize,
  roomType,
  durationMs,
  success,
  error = null,
  apiCost = 0,
}) {
  const log = {
    user_id: userId || 'anonymous',
    room_size: roomSize,
    room_type: roomType,
    duration_ms: durationMs,
    success,
    error_message: error,
    api_cost: apiCost,
    created_at: new Date().toISOString(),
  }

  const client = getSupabase()
  
  if (!client) {
    memoryGenerations.push(log)
    console.log(`[Generation Log] ${success ? '✓' : '✗'} ${durationMs}ms`, { roomSize, roomType, error })
    return
  }

  try {
    await client.from('generation_logs').insert(log)
  } catch (err) {
    console.error('Failed to log generation:', err)
    memoryGenerations.push(log)
  }
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats(days = 7) {
  const client = getSupabase()
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  if (!client) {
    // Return in-memory stats for development
    const recentGenerations = memoryGenerations.filter(g => g.created_at >= since)
    const successCount = recentGenerations.filter(g => g.success).length
    const failCount = recentGenerations.filter(g => !g.success).length
    const totalDuration = recentGenerations.reduce((sum, g) => sum + (g.duration_ms || 0), 0)
    const totalCost = recentGenerations.reduce((sum, g) => sum + (g.api_cost || 0), 0)

    return {
      totalGenerations: recentGenerations.length,
      successRate: recentGenerations.length > 0 ? (successCount / recentGenerations.length * 100).toFixed(1) : 0,
      errorRate: recentGenerations.length > 0 ? (failCount / recentGenerations.length * 100).toFixed(1) : 0,
      avgGenerationTime: recentGenerations.length > 0 ? Math.round(totalDuration / recentGenerations.length) : 0,
      totalCost: totalCost.toFixed(4),
      dailyCosts: [],
      eventCounts: memoryEvents.reduce((acc, e) => {
        acc[e.event_type] = (acc[e.event_type] || 0) + 1
        return acc
      }, {}),
    }
  }

  try {
    // Get generation stats
    const { data: generations } = await client
      .from('generation_logs')
      .select('*')
      .gte('created_at', since)

    const successCount = generations?.filter(g => g.success).length || 0
    const failCount = generations?.filter(g => !g.success).length || 0
    const total = generations?.length || 0
    const totalDuration = generations?.reduce((sum, g) => sum + (g.duration_ms || 0), 0) || 0
    const totalCost = generations?.reduce((sum, g) => sum + (g.api_cost || 0), 0) || 0

    // Get daily costs
    const dailyCosts = {}
    generations?.forEach(g => {
      const day = g.created_at.split('T')[0]
      dailyCosts[day] = (dailyCosts[day] || 0) + (g.api_cost || 0)
    })

    // Get event counts
    const { data: events } = await client
      .from('analytics_events')
      .select('event_type')
      .gte('created_at', since)

    const eventCounts = events?.reduce((acc, e) => {
      acc[e.event_type] = (acc[e.event_type] || 0) + 1
      return acc
    }, {}) || {}

    return {
      totalGenerations: total,
      successRate: total > 0 ? (successCount / total * 100).toFixed(1) : 0,
      errorRate: total > 0 ? (failCount / total * 100).toFixed(1) : 0,
      avgGenerationTime: total > 0 ? Math.round(totalDuration / total) : 0,
      totalCost: totalCost.toFixed(4),
      dailyCosts: Object.entries(dailyCosts).map(([date, cost]) => ({ date, cost: cost.toFixed(4) })),
      eventCounts,
    }
  } catch (error) {
    console.error('Failed to get dashboard stats:', error)
    return {
      totalGenerations: 0,
      successRate: 0,
      errorRate: 0,
      avgGenerationTime: 0,
      totalCost: '0',
      dailyCosts: [],
      eventCounts: {},
      error: error.message,
    }
  }
}

/**
 * Save user feedback
 */
export async function saveFeedback(userId, generationId, rating, comment = '') {
  const feedback = {
    user_id: userId || 'anonymous',
    generation_id: generationId,
    rating,
    comment,
    created_at: new Date().toISOString(),
  }

  const client = getSupabase()
  
  if (!client) {
    console.log('[Feedback]', feedback)
    return { success: true }
  }

  try {
    await client.from('user_feedback').insert(feedback)
    await trackEvent(EVENT_TYPES.FEEDBACK, { userId, rating })
    return { success: true }
  } catch (error) {
    console.error('Failed to save feedback:', error)
    return { success: false, error: error.message }
  }
}
