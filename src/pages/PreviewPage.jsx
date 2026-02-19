import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStaging } from '../context/StagingContext'
import { useI18n } from '../context/I18nContext'
import { checkQuota, generateStaging } from '../services/api'
import BetaBadge from '../components/BetaBadge'
import RoomSizeSelector from '../components/RoomSizeSelector'
import LoadingOverlay from '../components/LoadingOverlay'

const UPGRADE_URL = import.meta.env.VITE_UPGRADE_URL || ''

export default function PreviewPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { t, formatRemainingQuota } = useI18n()
  const {
    originalImageUrl,
    setOriginalImage,
    setOriginalImageUrl,
    roomSize,
    dailyQuota,
    isGenerating,
    setIsGenerating,
    setGenerationProgress,
    setGeneratedImageUrl,
    setDailyQuota,
    setRoomType,
    setError,
    originalImage,
  } = useStaging()

  useEffect(() => {
    if (!originalImageUrl) {
      navigate('/')
    }
  }, [originalImageUrl, navigate])

  useEffect(() => {
    const loadQuota = async () => {
      try {
        const quota = await checkQuota('anonymous')
        if (typeof quota?.remaining === 'number') {
          setDailyQuota(quota.remaining)
        }
      } catch (error) {
        console.warn('Failed to load quota:', error)
      }
    }

    loadQuota()
  }, [setDailyQuota])

  const handleChangeImage = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setOriginalImage(file)
      setOriginalImageUrl(imageUrl)
    }
  }

  const handleGenerate = async () => {
    if (!roomSize || dailyQuota <= 0 || !originalImage) return

    setIsGenerating(true)
    setError(null)
    setGenerationProgress(0)

    // Keep UI responsive while waiting for AI generation
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 500)

    try {
      const result = await generateStaging(originalImage, roomSize, 'anonymous')
      const generatedUrl = result?.data?.generatedImageUrl

      if (!generatedUrl) {
        throw new Error(t('preview.noGeneratedImage'))
      }

      setGeneratedImageUrl(generatedUrl)
      setRoomType(result?.data?.roomType || 'living room')
      if (typeof result?.data?.remaining === 'number') {
        setDailyQuota(result.data.remaining)
      }
      setGenerationProgress(100)

      clearInterval(progressInterval)

      setTimeout(() => {
        setIsGenerating(false)
        navigate('/result')
      }, 500)
    } catch (error) {
      console.error('Generation failed:', error)
      const message = error.message || t('common.generationFailed')
      setError(message)
      alert(message)
      setIsGenerating(false)
      clearInterval(progressInterval)
    }
  }

  const handleUpgrade = () => {
    if (UPGRADE_URL) {
      window.open(UPGRADE_URL, '_blank', 'noopener,noreferrer')
      return
    }
    alert(t('preview.upgradeComingSoon'))
  }

  if (!originalImageUrl) return null

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center px-6 py-12 relative">
      {isGenerating && <LoadingOverlay />}
      
      <BetaBadge />
      
      <h1 className="text-3xl font-bold text-white mt-8 mb-3">
        {t('common.appTitle')}
      </h1>
      
      <p className="text-gray-400 text-center max-w-xs mb-8">
        {t('common.appSubtitle')}
      </p>

      <div className="w-full max-w-sm relative">
        <div className="relative rounded-2xl overflow-hidden bg-dark-card">
          <img 
            src={originalImageUrl} 
            alt="Uploaded room" 
            className="w-full aspect-[4/3] object-cover"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-3 right-3 px-3 py-1.5 bg-dark-bg/80 backdrop-blur-sm text-white text-sm rounded-lg hover:bg-dark-bg transition-colors"
          >
            {t('common.change')}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleChangeImage}
          className="hidden"
        />
      </div>

      <div className="w-full max-w-sm mt-8">
        <h2 className="text-gray-400 text-sm font-medium mb-4 tracking-wider">
          {t('common.roomSizeTitle')}
        </h2>
        <RoomSizeSelector />
      </div>

      <div className="w-full max-w-sm mt-8">
        <button
          onClick={handleGenerate}
          disabled={!roomSize || dailyQuota <= 0}
          className="w-full py-4 px-6 bg-gold hover:bg-gold-light disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold rounded-xl transition-colors disabled:cursor-not-allowed"
        >
          {t('preview.generateStaging')}
        </button>
        
        <p className="text-gray-500 text-sm text-center mt-3">
          {formatRemainingQuota(dailyQuota)}
        </p>
        {dailyQuota <= 0 && (
          <div className="mt-3 rounded-xl border border-red-800 bg-red-950/20 p-3 text-center">
            <p className="text-red-300 text-sm">
              {t('preview.quotaReached')}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {t('preview.upgradePrompt')}
            </p>
            <button
              type="button"
              onClick={handleUpgrade}
              className="mt-3 px-4 py-2 rounded-lg bg-gold hover:bg-gold-light text-black text-sm font-semibold transition-colors"
            >
              {t('preview.upgradePlan')}
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs text-center mt-auto pt-8 max-w-xs">
        {t('common.betaDisclaimer')}
      </p>
    </div>
  )
}
