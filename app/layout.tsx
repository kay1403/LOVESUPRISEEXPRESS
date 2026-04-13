import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://loveexpress.rw'),
  title: 'LoveExpress | Organisation de surprises à Kigali',
  description: 'LoveExpress crée des moments de surprise inoubliables : anniversaires, demandes en mariage, baby showers. Livraison de gift baskets et décorations à Kigali, Rwanda.',
  keywords: 'surprise kigali, organisation anniversaire, demande mariage surprise, gift basket rwanda, décoration fête kigali',
  authors: [{ name: 'LoveExpress' }],
  openGraph: {
    title: 'LoveExpress - Créez des moments de surprise inoubliables',
    description: 'Organisation de surprises à Kigali : anniversaires, demandes en mariage, baby showers.',
    type: 'website',
    locale: 'fr_RW',
    images: [{ url: '/og-image.jpg' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
