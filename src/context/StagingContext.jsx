import { createContext, useContext, useState } from 'react'
import { DEFAULT_PROMPT_PRESET } from '../constants/promptPresets'

const StagingContext = createContext()

const RENOVATION_COSTS = {
  S: { LOW: 80000, MID: 150000, HIGH: 300000 },
  M: { LOW: 120000, MID: 300000, HIGH: 600000 },
  L: { LOW: 250000, MID: 600000, HIGH: 1200000 },
}

const ROOM_SIZE_LABELS = {
  S: { label: 'Small', range: '< 20 sqm' },
  M: { label: 'Medium', range: '20-40 sqm' },
  L: { label: 'Large', range: '40+ sqm' },
}

export function StagingProvider({ children }) {
  const [originalImage, setOriginalImage] = useState(null)
  const [originalImageUrl, setOriginalImageUrl] = useState(null)
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null)
  const [roomSize, setRoomSize] = useState(null)
  const [promptPreset, setPromptPreset] = useState(DEFAULT_PROMPT_PRESET)
  const [roomType, setRoomType] = useState('living room')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [dailyQuota, setDailyQuota] = useState(3)
  const [error, setError] = useState(null)

  const getRenovationCosts = () => {
    if (!roomSize) return null
    return RENOVATION_COSTS[roomSize]
  }

  const getRoomSizeInfo = () => {
    if (!roomSize) return null
    return ROOM_SIZE_LABELS[roomSize]
  }

  const resetState = () => {
    setOriginalImage(null)
    setOriginalImageUrl(null)
    setGeneratedImageUrl(null)
    setRoomSize(null)
    setPromptPreset(DEFAULT_PROMPT_PRESET)
    setRoomType('living room')
    setIsGenerating(false)
    setGenerationProgress(0)
    setError(null)
  }

  const value = {
    originalImage,
    setOriginalImage,
    originalImageUrl,
    setOriginalImageUrl,
    generatedImageUrl,
    setGeneratedImageUrl,
    roomSize,
    setRoomSize,
    promptPreset,
    setPromptPreset,
    roomType,
    setRoomType,
    isGenerating,
    setIsGenerating,
    generationProgress,
    setGenerationProgress,
    dailyQuota,
    setDailyQuota,
    error,
    setError,
    getRenovationCosts,
    getRoomSizeInfo,
    resetState,
    ROOM_SIZE_LABELS,
  }

  return (
    <StagingContext.Provider value={value}>
      {children}
    </StagingContext.Provider>
  )
}

export function useStaging() {
  const context = useContext(StagingContext)
  if (!context) {
    throw new Error('useStaging must be used within a StagingProvider')
  }
  return context
}
