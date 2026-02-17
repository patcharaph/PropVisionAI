import { Sparkles, Check } from 'lucide-react'
import { useStaging } from '../context/StagingContext'
import { useI18n } from '../context/I18nContext'

export default function LoadingOverlay() {
  const { generationProgress } = useStaging()
  const { t } = useI18n()
  const costReady = generationProgress > 30

  return (
    <div className="fixed inset-0 bg-dark-bg/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center px-6">
      <Sparkles className="w-16 h-16 text-gold mb-6 animate-pulse" />
      
      <div className="w-full max-w-xs mb-4">
        <div className="h-1.5 bg-dark-card rounded-full overflow-hidden">
          <div 
            className="h-full bg-gold rounded-full transition-all duration-300"
            style={{ width: `${Math.min(generationProgress, 100)}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mb-2">
        {t('loading.generatingDesign')}
      </h2>

      {costReady && (
        <div className="flex items-center gap-2 text-gold">
          <Check className="w-4 h-4" />
          <span className="text-sm">{t('loading.costEstimateReady')}</span>
        </div>
      )}

      <p className="text-gray-500 text-sm mt-4">
        {t('loading.mayTake')}
      </p>
    </div>
  )
}
