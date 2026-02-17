import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, ImagePlus } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { useStaging } from '../context/StagingContext'
import { useI18n } from '../context/I18nContext'
import { trackUpload } from '../services/api'
import BetaBadge from '../components/BetaBadge'

export default function LandingPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const { setOriginalImage, setOriginalImageUrl } = useStaging()
  const { t } = useI18n()

  const handleImageSelect = async (file) => {
    if (!file) return

    try {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      }
      const compressedFile = await imageCompression(file, options)
      const imageUrl = URL.createObjectURL(compressedFile)
      
      setOriginalImage(compressedFile)
      setOriginalImageUrl(imageUrl)
      
      // Track upload event
      trackUpload()
      
      navigate('/preview')
    } catch (error) {
      console.error('Error compressing image:', error)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleImageSelect(file)
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center px-6 py-12">
      <BetaBadge />
      
      <h1 className="text-3xl font-bold text-white mt-8 mb-3">
        {t('common.appTitle')}
      </h1>
      
      <p className="text-gray-400 text-center max-w-xs mb-12">
        {t('common.appSubtitle')}
      </p>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="w-full py-4 px-6 bg-gold hover:bg-gold-light text-black font-semibold rounded-xl flex items-center justify-center gap-3 transition-colors"
        >
          <Camera className="w-5 h-5" />
          {t('landing.takePhoto')}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 px-6 bg-dark-card border border-dark-border hover:border-gold/50 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-colors"
        >
          <ImagePlus className="w-5 h-5" />
          {t('landing.uploadFromGallery')}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-gray-500 text-xs text-center mt-auto pt-12 max-w-xs">
        {t('common.betaDisclaimer')}
      </p>
    </div>
  )
}
