import { useInstallPrompt } from '../hooks/useInstallPrompt'

export default function InstallButton() {
  const { isInstallable, promptInstall } = useInstallPrompt()

  if (!isInstallable) {
    return null
  }

  const handleInstall = async () => {
    const success = await promptInstall()
    if (success) {
      console.log('User accepted the install prompt')
    }
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="px-4 py-2 bg-gold hover:bg-gold-light text-black font-semibold rounded-lg transition-colors text-sm"
      title="Install PropVisionAI as an app"
    >
      + Install App
    </button>
  )
}
