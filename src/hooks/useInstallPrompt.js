import { useState, useEffect } from 'react'

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent default install prompt
      e.preventDefault()
      // Store the event for later use
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
      console.log('App installed successfully')
      setIsInstallable(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return false
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('App installation accepted')
        setDeferredPrompt(null)
        setIsInstallable(false)
        return true
      } else {
        console.log('App installation rejected')
        return false
      }
    } catch (error) {
      console.error('Installation failed:', error)
      return false
    }
  }

  return {
    isInstallable,
    promptInstall,
  }
}
