import { useI18n } from '../context/I18nContext'

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n()

  return (
    <div className="fixed top-4 right-4 z-50 inline-flex items-center bg-dark-card border border-dark-border rounded-full p-1">
      <button
        type="button"
        onClick={() => setLanguage('th')}
        className={`px-3 py-1 text-xs rounded-full transition-colors ${
          language === 'th' ? 'bg-gold text-black font-semibold' : 'text-gray-300 hover:text-white'
        }`}
      >
        {t('common.languageThai')}
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-xs rounded-full transition-colors ${
          language === 'en' ? 'bg-gold text-black font-semibold' : 'text-gray-300 hover:text-white'
        }`}
      >
        {t('common.languageEnglish')}
      </button>
    </div>
  )
}
