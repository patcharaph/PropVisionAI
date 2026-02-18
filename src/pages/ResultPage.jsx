import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Download } from 'lucide-react'
import { useStaging } from '../context/StagingContext'
import { useI18n } from '../context/I18nContext'
import { submitFeedback } from '../services/api'
import BetaBadge from '../components/BetaBadge'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import CostEstimateCard from '../components/CostEstimateCard'

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load image'))
    image.src = src
  })
}

export default function ResultPage() {
  const navigate = useNavigate()
  const { t, translateRoomType, getRoomSizeMeta } = useI18n()
  const {
    originalImageUrl,
    generatedImageUrl,
    roomSize,
    roomType,
    resetState,
  } = useStaging()

  const [isSavingImage, setIsSavingImage] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackStatus, setFeedbackStatus] = useState('idle')

  useEffect(() => {
    if (!originalImageUrl) {
      navigate('/')
    }
  }, [originalImageUrl, navigate])

  const handleBack = () => {
    resetState()
    navigate('/')
  }

  const roomSizeMeta = roomSize ? getRoomSizeMeta(roomSize) : null
  const localizedRoomType = translateRoomType(roomType)
  const generationId = useMemo(() => {
    if (!generatedImageUrl) return `gen-${Date.now()}`
    const segments = generatedImageUrl.split('/')
    const last = segments[segments.length - 1] || `gen-${Date.now()}`
    return last.replace(/[^a-zA-Z0-9_-]/g, '')
  }, [generatedImageUrl])

  const handleSaveWithWatermark = async () => {
    if (!generatedImageUrl) return

    setIsSavingImage(true)
    try {
      const imageResponse = await fetch(generatedImageUrl)
      if (!imageResponse.ok) {
        throw new Error('Image download failed')
      }

      const imageBlob = await imageResponse.blob()
      const sourceUrl = URL.createObjectURL(imageBlob)
      const image = await loadImage(sourceUrl)

      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        URL.revokeObjectURL(sourceUrl)
        throw new Error('Canvas not available')
      }

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

      const watermark = 'PropVisionAI'
      const fontSize = Math.max(18, Math.round(canvas.width * 0.03))
      const padding = Math.round(fontSize * 0.7)
      const margin = Math.round(fontSize * 0.8)
      ctx.font = `600 ${fontSize}px sans-serif`
      const textWidth = ctx.measureText(watermark).width
      const boxWidth = Math.round(textWidth + padding * 2)
      const boxHeight = Math.round(fontSize + padding)
      const boxX = canvas.width - boxWidth - margin
      const boxY = canvas.height - boxHeight - margin

      ctx.fillStyle = 'rgba(107, 114, 128, 0.45)'
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight)
      ctx.fillStyle = '#f5c84b'
      ctx.fillText(watermark, boxX + padding, boxY + boxHeight - Math.round(padding * 0.35))

      const outputBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png')
      })

      URL.revokeObjectURL(sourceUrl)

      if (!outputBlob) {
        throw new Error('Output image is empty')
      }

      const downloadUrl = URL.createObjectURL(outputBlob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `propvisionai-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Save image failed:', error)
      alert(t('result.saveImageFailed'))
    } finally {
      setIsSavingImage(false)
    }
  }

  const handleSubmitFeedback = async () => {
    if (feedbackRating < 1 || feedbackStatus === 'submitting') return

    setFeedbackStatus('submitting')
    try {
      await submitFeedback('anonymous', generationId, feedbackRating, feedbackComment.trim())
      setFeedbackStatus('success')
    } catch (error) {
      console.error('Feedback submit failed:', error)
      setFeedbackStatus('error')
    }
  }

  if (!originalImageUrl) return null

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('common.back')}</span>
        </button>
        <BetaBadge />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gold mb-1">
          {t('result.pageTitle')}
        </h1>
        <p className="text-gray-400 text-sm">
          {t('result.styleSummary', {
            roomType: localizedRoomType,
            roomSize: roomSizeMeta?.label || roomSize || '',
          })}
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto mb-4">
        <BeforeAfterSlider
          beforeImage={originalImageUrl}
          afterImage={generatedImageUrl || '/demo-after.jpg'}
        />
      </div>

      <div className="w-full max-w-lg mx-auto mb-8">
        <button
          type="button"
          onClick={handleSaveWithWatermark}
          disabled={!generatedImageUrl || isSavingImage}
          className="w-full py-3 px-4 bg-dark-card border border-gold/60 hover:border-gold text-white rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          {isSavingImage ? t('result.savingImage') : t('result.saveWithWatermark')}
        </button>
      </div>

      <div className="w-full max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-semibold text-white">
            {t('result.estimatedRenovationCost')}
          </h2>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          {t('result.detected', { roomType: localizedRoomType })}
        </p>

        <CostEstimateCard />

        <p className="text-gray-400 text-sm mt-6 leading-relaxed">
          {t('result.renovationSummary', {
            sizeLabel: roomSizeMeta?.adjective || roomSize || '',
            roomType: localizedRoomType,
          })}
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto mt-8 bg-dark-card border border-dark-border rounded-2xl p-4">
        <h3 className="text-white font-semibold mb-1">{t('result.feedbackTitle')}</h3>
        <p className="text-gray-400 text-sm mb-4">{t('result.feedbackHint')}</p>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFeedbackRating(value)}
              className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-colors ${
                feedbackRating >= value
                  ? 'bg-gold border-gold text-black'
                  : 'bg-transparent border-dark-border text-gray-300 hover:border-gray-500'
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <textarea
          value={feedbackComment}
          onChange={(event) => setFeedbackComment(event.target.value)}
          rows={3}
          placeholder={t('result.feedbackCommentPlaceholder')}
          className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold mb-3"
        />

        <button
          type="button"
          onClick={handleSubmitFeedback}
          disabled={feedbackRating < 1 || feedbackStatus === 'submitting'}
          className="w-full py-3 px-4 bg-gold hover:bg-gold-light text-black font-semibold rounded-xl transition-colors disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {feedbackStatus === 'submitting' ? t('result.feedbackSubmitting') : t('result.submitFeedback')}
        </button>

        {feedbackStatus === 'success' && (
          <p className="text-green-400 text-sm mt-3">{t('result.feedbackSuccess')}</p>
        )}
        {feedbackStatus === 'error' && (
          <p className="text-red-400 text-sm mt-3">{t('result.feedbackError')}</p>
        )}
      </div>
    </div>
  )
}
