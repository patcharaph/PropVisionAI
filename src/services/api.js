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
