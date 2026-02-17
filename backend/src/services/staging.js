import { logGeneration, trackEvent, EVENT_TYPES } from './analytics.js'

const RENOVATION_COSTS = {
  S: { LOW: 80000, MID: 150000, HIGH: 300000 },
  M: { LOW: 120000, MID: 300000, HIGH: 600000 },
  L: { LOW: 250000, MID: 600000, HIGH: 1200000 },
}

const ROOM_DENSITY_PROMPTS = {
  S: 'minimal furniture, compact layout, space-efficient design',
  M: 'moderate furniture arrangement, balanced layout',
  L: 'spacious layout, multiple furniture groupings, generous spacing',
}

// API cost estimates (USD)
const API_COSTS = {
  OPENROUTER_HAIKU: 0.0003, // ~$0.25/1M input + image
  FAL_FLUX: 0.01, // ~$0.01 per image
}

const FAL_TIMEOUT_MS = 20000 // 20 seconds timeout

export async function generateStaging(imageBuffer, roomSize, userId = 'anonymous') {
  const startTime = Date.now()
  let roomAnalysis = { roomType: 'living room', features: [] }
  let apiCost = 0

  try {
    await trackEvent(EVENT_TYPES.GENERATE_START, { userId, roomSize })

    // Step 1: Analyze room with OpenRouter
    roomAnalysis = await analyzeRoom(imageBuffer)
    apiCost += API_COSTS.OPENROUTER_HAIKU
    
    // Step 2: Generate staged image with Fal.ai (with timeout)
    const generatedImage = await generateImageWithTimeout(imageBuffer, roomSize, roomAnalysis)
    apiCost += API_COSTS.FAL_FLUX

    const durationMs = Date.now() - startTime

    // Log successful generation
    await logGeneration({
      userId,
      roomSize,
      roomType: roomAnalysis.roomType,
      durationMs,
      success: true,
      apiCost,
    })

    await trackEvent(EVENT_TYPES.GENERATE_SUCCESS, { userId, roomSize, durationMs })
    
    return {
      imageUrl: generatedImage.url,
      roomType: roomAnalysis.roomType,
      costs: RENOVATION_COSTS[roomSize],
      durationMs,
      timedOut: generatedImage.timedOut || false,
    }
  } catch (error) {
    const durationMs = Date.now() - startTime

    // Log failed generation
    await logGeneration({
      userId,
      roomSize,
      roomType: roomAnalysis.roomType,
      durationMs,
      success: false,
      error: error.message,
      apiCost,
    })

    await trackEvent(EVENT_TYPES.GENERATE_FAIL, { userId, roomSize, error: error.message })

    throw error
  }
}

async function analyzeRoom(imageBuffer) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not configured, using default room type')
    return { roomType: 'living room', features: [] }
  }

  try {
    const base64Image = imageBuffer.toString('base64')
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${base64Image}` }
              },
              {
                type: 'text',
                text: `Analyze this room image. Respond with JSON only:
{
  "roomType": "living room|bedroom|kitchen|bathroom|dining room|office",
  "features": ["list of notable features"],
  "currentStyle": "description of current style"
}`
              }
            ]
          }
        ]
      })
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || '{}'
    const parsed = JSON.parse(content)
    
    return {
      roomType: parsed.roomType || 'living room',
      features: parsed.features || []
    }
  } catch (error) {
    console.error('Room analysis error:', error)
    return { roomType: 'living room', features: [] }
  }
}

/**
 * Generate image with timeout protection
 * If Fal.ai takes > 20s, return fallback image
 */
async function generateImageWithTimeout(imageBuffer, roomSize, roomAnalysis) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT')), FAL_TIMEOUT_MS)
  })

  try {
    const result = await Promise.race([
      generateImage(imageBuffer, roomSize, roomAnalysis),
      timeoutPromise
    ])
    return result
  } catch (error) {
    if (error.message === 'TIMEOUT') {
      console.warn(`Fal.ai timeout after ${FAL_TIMEOUT_MS}ms, using fallback`)
      await trackEvent(EVENT_TYPES.GENERATE_TIMEOUT, { roomSize })
      return { url: '/demo-after.jpg', timedOut: true }
    }
    throw error
  }
}

async function generateImage(imageBuffer, roomSize, roomAnalysis) {
  const FAL_API_KEY = process.env.FAL_API_KEY
  
  if (!FAL_API_KEY) {
    console.warn('Fal.ai API key not configured, returning placeholder')
    return { url: '/demo-after.jpg' }
  }

  const densityPrompt = ROOM_DENSITY_PROMPTS[roomSize]
  
  const prompt = `Transform this ${roomAnalysis.roomType} into a modern, professionally staged interior.
Style: Modern Scandinavian minimalist design.
Requirements:
- ${densityPrompt}
- Clean lines, neutral color palette (whites, grays, warm wood tones)
- Natural lighting enhancement
- Remove clutter and personal items
- Add contemporary furniture and decor
- Maintain original room layout and window positions
- Do NOT alter structural walls or windows
- Professional real estate photography quality`

  try {
    const base64Image = imageBuffer.toString('base64')
    
    const response = await fetch('https://fal.run/fal-ai/flux/dev/image-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: `data:image/jpeg;base64,${base64Image}`,
        prompt,
        strength: 0.75,
        num_inference_steps: 28,
        guidance_scale: 7.5,
      })
    })

    const data = await response.json()
    console.log('Fal.ai response:', JSON.stringify(data, null, 2))
    
    if (data.error || data.detail) {
      console.error('Fal.ai API error:', data.error || data.detail)
      return { url: '/demo-after.jpg' }
    }
    
    return { url: data.images?.[0]?.url || '/demo-after.jpg' }
  } catch (error) {
    console.error('Image generation error:', error)
    return { url: '/demo-after.jpg' }
  }
}
