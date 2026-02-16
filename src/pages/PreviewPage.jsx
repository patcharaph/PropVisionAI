import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStaging } from '../context/StagingContext'
import BetaBadge from '../components/BetaBadge'
import RoomSizeSelector from '../components/RoomSizeSelector'
import LoadingOverlay from '../components/LoadingOverlay'

export default function PreviewPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
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
  } = useStaging()

  useEffect(() => {
    if (!originalImageUrl) {
      navigate('/')
    }
  }, [originalImageUrl, navigate])

  const handleChangeImage = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setOriginalImage(file)
      setOriginalImageUrl(imageUrl)
    }
  }

  const handleGenerate = async () => {
    if (!roomSize || dailyQuota <= 0) return

    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 500)

    // Simulate API call - in production this would call the backend
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // For demo, use a placeholder generated image
      setGeneratedImageUrl('/demo-after.jpg')
      setGenerationProgress(100)
      
      clearInterval(progressInterval)
      
      setTimeout(() => {
        setIsGenerating(false)
        navigate('/result')
      }, 500)
    } catch (error) {
      console.error('Generation failed:', error)
      setIsGenerating(false)
      clearInterval(progressInterval)
    }
  }

  if (!originalImageUrl) return null

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center px-6 py-12 relative">
      {isGenerating && <LoadingOverlay />}
      
      <BetaBadge />
      
      <h1 className="text-3xl font-bold text-white mt-8 mb-3">
        Virtual Staging
      </h1>
      
      <p className="text-gray-400 text-center max-w-xs mb-8">
        See your property transformed in seconds with AI-powered modern design
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
            Change
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
          ROOM SIZE
        </h2>
        <RoomSizeSelector />
      </div>

      <div className="w-full max-w-sm mt-8">
        <button
          onClick={handleGenerate}
          disabled={!roomSize || dailyQuota <= 0}
          className="w-full py-4 px-6 bg-gold hover:bg-gold-light disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold rounded-xl transition-colors disabled:cursor-not-allowed"
        >
          Generate Staging
        </button>
        
        <p className="text-gray-500 text-sm text-center mt-3">
          {dailyQuota} generation{dailyQuota !== 1 ? 's' : ''} remaining today
        </p>
      </div>

      <p className="text-gray-500 text-xs text-center mt-auto pt-8 max-w-xs">
        Beta version. Estimates for visualization only. Actual renovation costs may vary.
        Not a professional quote or valuation.
      </p>
    </div>
  )
}
