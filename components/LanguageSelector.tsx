'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// Initialiser i18n uniquement côté client
let i18nInstance: any = null

const languages = [
  { code: 'fr', name: 'Français', flag: '��🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' }
]

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { i18n, t } = useTranslation()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const currentLangCode = i18n.language
  const currentLang = languages.find(l => l.code === currentLangCode) || languages[0]

  const selectLanguage = (lang: typeof languages[0]) => {
    i18n.changeLanguage(lang.code)
    setIsOpen(false)
  }

  // Éviter l'hydratation mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 shadow-sm">
        <Globe size={18} className="text-gray-500" />
        <span className="text-lg">🇫🇷</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 hover:bg-white transition shadow-sm text-gray-700"
      >
        <Globe size={18} />
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden md:inline text-sm font-medium">{currentLang.name}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden z-50 min-w-[150px] border border-gray-100"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang)}
                className={`w-full px-4 py-3 text-left hover:bg-primaryLight transition flex items-center gap-3 ${
                  currentLangCode === lang.code ? 'bg-primaryLight text-primary' : 'text-gray-700'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {currentLangCode === lang.code && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
