'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Clock, Mail, Phone, MessageCircle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

interface MaintenanceBannerProps {
  message?: string
  endDate?: string
  contactEmail?: string
  showWhatsApp?: boolean
}

export default function MaintenanceBanner({ 
  message = '', 
  endDate, 
  contactEmail, 
  showWhatsApp = true 
}: MaintenanceBannerProps) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(true)
  
  if (!isVisible) return null

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS || '250799366007'
  const safeMessage = message || t('maintenance.defaultMessage') || 'Formulaire temporairement indisponible.'

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-6 mb-8 shadow-sm"
    >
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
      >
        <X size={18} />
      </button>
      
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={24} className="text-amber-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            {t('maintenance.title') || 'Formulaire temporairement indisponible'}
          </h3>
          
          <p className="text-gray-700 mb-4">{safeMessage}</p>
          
          {endDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Clock size={16} />
              <span>
                {t('maintenance.expectedEnd') || 'Reprise estimée'} : {endDate}
              </span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 mt-3">
            {showWhatsApp && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <MessageCircle size={18} />
                {t('maintenance.contactWhatsApp') || 'Nous contacter sur WhatsApp'}
              </a>
            )}
            
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                <Mail size={18} />
                {t('maintenance.sendEmail') || 'Envoyer un email'}
              </a>
            )}
            
            <a
              href="tel:+250799366007"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition"
            >
              <Phone size={18} />
              {t('maintenance.callUs') || 'Nous appeler'}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}