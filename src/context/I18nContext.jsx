import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const I18nContext = createContext()
const STORAGE_KEY = 'pvai_lang'
const SUPPORTED_LANGS = ['en', 'th']

const MESSAGES = {
  en: {
    common: {
      appTitle: 'Virtual Staging',
      appSubtitle: 'See your property transformed in seconds with AI-powered modern design',
      betaTag: 'BETA',
      betaDisclaimer: 'Beta version. Estimates for visualization only. Actual renovation costs may vary. Not a professional quote or valuation.',
      back: 'Back',
      change: 'Change',
      roomSizeTitle: 'ROOM SIZE',
      generationFailed: 'Generation failed',
      enterAdminKey: 'Enter admin API key:',
      failedToFetchStats: 'Failed to fetch stats',
      languageEnglish: 'EN',
      languageThai: 'TH',
    },
    landing: {
      takePhoto: 'Take a Photo',
      uploadFromGallery: 'Upload from Gallery',
    },
    preview: {
      generateStaging: 'Generate Staging',
      remainingQuota: '{{count}} generation{{suffix}} remaining today',
      noGeneratedImage: 'No generated image returned from API',
      quotaReached: 'Daily generation limit reached. Please come back tomorrow.',
      upgradePrompt: 'Need more generations today? Upgrade to Pro for higher limits.',
      upgradePlan: 'Upgrade Plan',
      upgradeComingSoon: 'Upgrade checkout is coming soon. Please contact support.',
    },
    loading: {
      generatingDesign: 'Generating design...',
      costEstimateReady: 'Cost estimate ready',
      mayTake: 'This may take up to 25 seconds',
    },
    result: {
      pageTitle: 'Your Staging Result',
      styleSummary: '{{roomType}} • Size {{roomSize}} • Modern Style',
      estimatedRenovationCost: 'Estimated Renovation Cost',
      detected: 'Detected: {{roomType}}',
      renovationSummary:
        'For a {{sizeLabel}} {{roomType}} renovation, typical updates might include modernizing the floor with sleek tiles or hardwood, refreshing the paint with neutral tones, and incorporating contemporary furniture and lighting for a stylish, modern aesthetic.',
      saveWithWatermark: 'Save Image with Watermark',
      savingImage: 'Saving...',
      saveImageFailed: 'Unable to save image. Please try again.',
      feedbackTitle: 'Rate This Result',
      feedbackHint: 'Your feedback helps improve staging quality.',
      feedbackCommentPlaceholder: 'Share what you like or what should improve...',
      submitFeedback: 'Submit Feedback',
      feedbackSubmitting: 'Submitting...',
      feedbackSuccess: 'Thanks! Your feedback has been sent.',
      feedbackError: 'Failed to submit feedback. Please try again.',
    },
    roomTypes: {
      living_room: 'living room',
      bedroom: 'bedroom',
      kitchen: 'kitchen',
      bathroom: 'bathroom',
      dining_room: 'dining room',
      office: 'office',
    },
    roomSize: {
      S: { label: 'Small', range: '< 20 sqm', adjective: 'small-sized' },
      M: { label: 'Medium', range: '20-40 sqm', adjective: 'medium-sized' },
      L: { label: 'Large', range: '40+ sqm', adjective: 'large-sized' },
    },
    slider: {
      before: 'BEFORE',
      after: 'AFTER',
    },
    cost: {
      low: 'LOW',
      mid: 'MID',
      high: 'HIGH',
    },
    admin: {
      title: 'Admin Dashboard',
      last24h: 'Last 24h',
      last7days: 'Last 7 days',
      last30days: 'Last 30 days',
      loading: 'Loading stats...',
      totalGenerations: 'Total Generations',
      avgTime: 'Avg Time',
      perGeneration: 'per generation',
      errorRate: 'Error Rate',
      totalCost: 'Total Cost',
      apiCosts: 'API costs',
      eventCounts: 'Event Counts',
      noEventsRecorded: 'No events recorded',
      dailyCosts: 'Daily Costs',
      noCostData: 'No cost data',
      conversionFunnel: 'Conversion Funnel',
      uploads: 'Uploads',
      started: 'Started',
      success: 'Success',
      shared: 'Shared',
    },
    events: {
      upload: 'Upload',
      generate_start: 'Generate Start',
      generate_success: 'Generate Success',
      generate_fail: 'Generate Fail',
      generate_timeout: 'Generate Timeout',
      share: 'Share',
      feedback: 'Feedback',
    },
  },
  th: {
    common: {
      appTitle: 'จัดฉากอสังหาฯ ด้วย AI',
      appSubtitle: 'เปลี่ยนภาพทรัพย์ของคุณให้ดูทันสมัยในไม่กี่วินาทีด้วย AI',
      betaTag: 'เบต้า',
      betaDisclaimer: 'เวอร์ชันเบต้า ใช้เพื่อการมองภาพรวมเท่านั้น ค่ารีโนเวทจริงอาจแตกต่าง และไม่ใช่ใบเสนอราคาวิชาชีพ',
      back: 'ย้อนกลับ',
      change: 'เปลี่ยนรูป',
      roomSizeTitle: 'ขนาดห้อง',
      generationFailed: 'สร้างภาพไม่สำเร็จ',
      enterAdminKey: 'กรอก admin API key:',
      failedToFetchStats: 'ดึงสถิติไม่สำเร็จ',
      languageEnglish: 'EN',
      languageThai: 'TH',
    },
    landing: {
      takePhoto: 'ถ่ายรูป',
      uploadFromGallery: 'อัปโหลดจากคลังภาพ',
    },
    preview: {
      generateStaging: 'สร้างภาพจัดฉาก',
      remainingQuota: 'เหลือสิทธิ์สร้างภาพวันนี้ {{count}} ครั้ง',
      noGeneratedImage: 'API ไม่ได้ส่งรูปที่สร้างกลับมา',
    },
    loading: {
      generatingDesign: 'กำลังสร้างดีไซน์...',
      costEstimateReady: 'ประมาณการค่าใช้จ่ายพร้อมแล้ว',
      mayTake: 'ขั้นตอนนี้อาจใช้เวลาสูงสุดประมาณ 25 วินาที',
    },
    result: {
      pageTitle: 'ผลลัพธ์การจัดฉาก',
      styleSummary: '{{roomType}} • ขนาด {{roomSize}} • สไตล์โมเดิร์น',
      estimatedRenovationCost: 'ประมาณการค่ารีโนเวท',
      detected: 'ตรวจพบ: {{roomType}}',
      renovationSummary:
        'สำหรับการรีโนเวต{{roomType}}{{sizeLabel}} โดยทั่วไปอาจเริ่มจากปรับพื้นให้ทันสมัยด้วยกระเบื้องหรือไม้ ปรับโทนสีผนังให้เป็นโทนกลาง และเพิ่มเฟอร์นิเจอร์กับแสงไฟร่วมสมัย เพื่อบรรยากาศที่ดูทันสมัยและมีสไตล์',
    },
    roomTypes: {
      living_room: 'ห้องนั่งเล่น',
      bedroom: 'ห้องนอน',
      kitchen: 'ห้องครัว',
      bathroom: 'ห้องน้ำ',
      dining_room: 'ห้องทานอาหาร',
      office: 'ห้องทำงาน',
    },
    roomSize: {
      S: { label: 'เล็ก', range: '< 20 ตร.ม.', adjective: 'ขนาดเล็ก' },
      M: { label: 'กลาง', range: '20-40 ตร.ม.', adjective: 'ขนาดกลาง' },
      L: { label: 'ใหญ่', range: '40+ ตร.ม.', adjective: 'ขนาดใหญ่' },
    },
    slider: {
      before: 'ก่อน',
      after: 'หลัง',
    },
    cost: {
      low: 'ต่ำ',
      mid: 'กลาง',
      high: 'สูง',
    },
    admin: {
      title: 'แดชบอร์ดผู้ดูแล',
      last24h: '24 ชั่วโมงล่าสุด',
      last7days: '7 วันล่าสุด',
      last30days: '30 วันล่าสุด',
      loading: 'กำลังโหลดสถิติ...',
      totalGenerations: 'จำนวนครั้งที่สร้าง',
      avgTime: 'เวลาเฉลี่ย',
      perGeneration: 'ต่อครั้ง',
      errorRate: 'อัตราผิดพลาด',
      totalCost: 'ค่าใช้จ่ายรวม',
      apiCosts: 'ค่าใช้ API',
      eventCounts: 'จำนวนเหตุการณ์',
      noEventsRecorded: 'ยังไม่มีข้อมูลเหตุการณ์',
      dailyCosts: 'ค่าใช้จ่ายรายวัน',
      noCostData: 'ยังไม่มีข้อมูลค่าใช้จ่าย',
      conversionFunnel: 'เส้นทางคอนเวอร์ชัน',
      uploads: 'อัปโหลด',
      started: 'เริ่มสร้าง',
      success: 'สำเร็จ',
      shared: 'แชร์',
    },
    events: {
      upload: 'อัปโหลด',
      generate_start: 'เริ่มสร้าง',
      generate_success: 'สร้างสำเร็จ',
      generate_fail: 'สร้างไม่สำเร็จ',
      generate_timeout: 'สร้างเกินเวลา',
      share: 'แชร์',
      feedback: 'ฟีดแบ็ก',
    },
  },
}

function resolveMessage(language, key) {
  const localized = key.split('.').reduce((acc, part) => acc?.[part], MESSAGES[language])
  if (localized !== undefined) {
    return localized
  }
  return key.split('.').reduce((acc, part) => acc?.[part], MESSAGES.en)
}

function interpolate(template, params = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, token) => {
    if (params[token] === undefined || params[token] === null) {
      return ''
    }
    return String(params[token])
  })
}

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && SUPPORTED_LANGS.includes(stored)) {
      return stored
    }
  } catch {
    // ignore localStorage access errors
  }

  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('th')) {
    return 'th'
  }

  return 'en'
}

function normalizeRoomTypeKey(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, '_')
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)

  const updateLanguage = useCallback((nextLanguage) => {
    const safeLanguage = SUPPORTED_LANGS.includes(nextLanguage) ? nextLanguage : 'en'
    setLanguage(safeLanguage)
    try {
      localStorage.setItem(STORAGE_KEY, safeLanguage)
    } catch {
      // ignore localStorage access errors
    }
  }, [])

  const t = useCallback(
    (key, params) => {
      const value = resolveMessage(language, key)
      if (typeof value !== 'string') {
        return key
      }
      return interpolate(value, params)
    },
    [language]
  )

  const translateRoomType = useCallback(
    (roomType) => {
      const key = normalizeRoomTypeKey(roomType)
      const value = resolveMessage(language, `roomTypes.${key}`)
      if (typeof value === 'string') {
        return value
      }
      return roomType || ''
    },
    [language]
  )

  const translateEventType = useCallback(
    (eventType) => {
      const value = resolveMessage(language, `events.${eventType}`)
      if (typeof value === 'string') {
        return value
      }
      return eventType
    },
    [language]
  )

  const getRoomSizeMeta = useCallback(
    (sizeKey) => {
      const size = resolveMessage(language, `roomSize.${sizeKey}`)
      if (size && typeof size === 'object') {
        return size
      }
      return { label: sizeKey, range: '', adjective: sizeKey }
    },
    [language]
  )

  const formatRemainingQuota = useCallback(
    (count) => {
      if (language === 'th') {
        return t('preview.remainingQuota', { count })
      }
      return t('preview.remainingQuota', { count, suffix: count === 1 ? '' : 's' })
    },
    [language, t]
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage: updateLanguage,
      t,
      translateRoomType,
      translateEventType,
      getRoomSizeMeta,
      formatRemainingQuota,
    }),
    [formatRemainingQuota, getRoomSizeMeta, language, t, translateEventType, translateRoomType, updateLanguage]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
