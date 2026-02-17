import { useI18n } from '../context/I18nContext'

export default function BetaBadge() {
  const { t } = useI18n()

  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-dark-card border border-dark-border rounded-full">
      <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
      <span className="text-sm font-medium text-gray-300">{t('common.betaTag')}</span>
    </div>
  )
}
