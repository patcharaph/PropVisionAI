const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function generateStaging(imageFile, roomSize, userId = 'anonymous') {
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('roomSize', roomSize)
  formData.append('userId', userId)

  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Generation failed')
  }

  return response.json()
}

export async function checkQuota(userId = 'anonymous') {
  const response = await fetch(`${API_BASE_URL}/api/quota/${userId}`)
  
  if (!response.ok) {
    return { remaining: 3 } // Default fallback
  }

  return response.json()
}

// Track upload event
export async function trackUpload(userId = 'anonymous') {
  try {
    await fetch(`${API_BASE_URL}/api/track/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
  } catch (error) {
    console.warn('Failed to track upload:', error)
  }
}

// Track share event
export async function trackShare(userId = 'anonymous', platform = 'unknown') {
  try {
    await fetch(`${API_BASE_URL}/api/track/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, platform }),
    })
  } catch (error) {
    console.warn('Failed to track share:', error)
  }
}

// Submit feedback
export async function submitFeedback(userId, generationId, rating, comment = '') {
  const response = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, generationId, rating, comment }),
  })

  if (!response.ok) {
    throw new Error('Failed to submit feedback')
  }

  return response.json()
}
