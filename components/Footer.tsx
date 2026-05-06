// components/Footer.tsx
'use client'

import { useFooterSafe } from '@/lib/api-wrapper'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const { data: footer, loading, error } = useFooterSafe()

  if (loading) {
    return (
      <footer className="bg-dark text-white py-12">
        <div className="container-custom text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-dark text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-2xl font-bold text-primary mb-4">{footer.companyName}</h3>
            <p className="text-gray-400 text-sm">{footer.slogan}</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Tel: {footer.phone1}</li>
              <li>Tel: {footer.phone2}</li>
              <li>{footer.address}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {footer.services?.map((service: string, idx: number) => (
                <li key={idx}>{service}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.hours')}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {footer.hours?.map((hour: { day: string; time: string }, idx: number) => (
                <li key={idx}>{hour.day}: {hour.time}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {footer.year || new Date().getFullYear()} {footer.companyName}. {footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}