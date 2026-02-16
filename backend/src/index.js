import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import { generateStaging } from './services/staging.js'
import { checkQuota, decrementQuota } from './services/quota.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Generate staging endpoint
app.post('/api/generate', upload.single('image'), async (req, res) => {
  try {
    const { roomSize, userId } = req.body
    const imageFile = req.file

    if (!imageFile) {
      return res.status(400).json({ error: 'Image file is required' })
    }

    if (!roomSize || !['S', 'M', 'L'].includes(roomSize)) {
      return res.status(400).json({ error: 'Valid room size (S, M, L) is required' })
    }

    // Check user quota
    const quotaCheck = await checkQuota(userId)
    if (!quotaCheck.allowed) {
      return res.status(429).json({ 
        error: 'Daily generation limit reached',
        remaining: 0 
      })
    }

    // Generate staging
    const result = await generateStaging(imageFile.buffer, roomSize)

    // Decrement quota on success
    await decrementQuota(userId)

    res.json({
      success: true,
      data: {
        generatedImageUrl: result.imageUrl,
        roomType: result.roomType,
        roomSize,
        costs: result.costs,
        remaining: quotaCheck.remaining - 1
      }
    })

  } catch (error) {
    console.error('Generation error:', error)
    res.status(500).json({ 
      error: 'Generation failed',
      message: error.message 
    })
  }
})

// Get user quota
app.get('/api/quota/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const quota = await checkQuota(userId)
    res.json({ remaining: quota.remaining })
  } catch (error) {
    res.status(500).json({ error: 'Failed to check quota' })
  }
})

app.listen(PORT, () => {
  console.log(`PropVisionAI Backend running on port ${PORT}`)
})
