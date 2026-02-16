import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import { useStaging } from '../context/StagingContext'
import BetaBadge from '../components/BetaBadge'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import CostEstimateCard from '../components/CostEstimateCard'

export default function ResultPage() {
  const navigate = useNavigate()
  const { 
    originalImageUrl, 
    generatedImageUrl,
    roomSize,
    roomType,
    getRoomSizeInfo,
    resetState,
  } = useStaging()

  useEffect(() => {
    if (!originalImageUrl) {
      navigate('/')
    }
  }, [originalImageUrl, navigate])

  const handleBack = () => {
    resetState()
    navigate('/')
  }

  const roomSizeInfo = getRoomSizeInfo()

  if (!originalImageUrl) return null

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <BetaBadge />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gold mb-1">
          Your Staging Result
        </h1>
        <p className="text-gray-400 text-sm">
          {roomType} • Size {roomSize} • Modern Style
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto mb-8">
        <BeforeAfterSlider 
          beforeImage={originalImageUrl}
          afterImage={generatedImageUrl || '/demo-after.jpg'}
        />
      </div>

      <div className="w-full max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-semibold text-white">
            Estimated Renovation Cost
          </h2>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">
          Detected: {roomType}
        </p>

        <CostEstimateCard />

        <p className="text-gray-400 text-sm mt-6 leading-relaxed">
          For a {roomSizeInfo?.label.toLowerCase()}-sized {roomType} renovation in Thailand, 
          typical updates might include modernizing the floor with sleek tiles or hardwood, 
          refreshing the paint with neutral tones, and incorporating contemporary furniture 
          and lighting for a stylish, modern aesthetic.
        </p>
      </div>
    </div>
  )
}
