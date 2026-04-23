'use client'

import { useState, useEffect } from 'react'

interface FooterData {
  companyName: string
  slogan: string
  phone1: string
  phone2: string
  address: string
  hours: { day: string; time: string }[]
  services: string[]
  copyright: string
  year?: number
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null)
  const [loading, setLoading] = useState(true)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    fetchFooter()
  }, [])

  const fetchFooter = async () => {
    try {
      const response = await fetch('/api/cms/footer')
      const data = await response.json()
      if (data.success && data.footer) {
        setFooterData(data.footer)
      }
    } catch (error) {
      console.error('Erreur chargement footer:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <footer className="bg-dark text-white py-12">
        <div className="container-custom text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </footer>
    )
  }

  const data = footerData || {
    companyName: "LoveExpress",
    slogan: "We deliver love and kindness. Créons ensemble des moments inoubliables.",
    phone1: "+250 799 366 007",
    phone2: "+250 737 769 092",
    address: "Kigali, Rwanda",
    hours: [
      { day: "Lundi - Samedi", time: "9h - 19h" },
      { day: "Dimanche", time: "Sur rendez-vous" },
      { day: "Livraison 24/24", time: "Sur demande" }
    ],
    services: ["Party Decoration", "Surprise Planner", "Flower Bouquet", "Gift Baskets"],
    copyright: "Tous droits réservés"
  }

  return (
    <footer className="bg-dark text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colonne 1 - Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-primary mb-4">
              {data.companyName}
            </h3>
            <p className="text-gray-400 text-sm">
              {data.slogan}
            </p>
          </div>
          
          {/* Colonne 2 - Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Tel: {data.phone1}</li>
              <li>Tel: {data.phone2}</li>
              <li>{data.address}</li>
            </ul>
          </div>
          
          {/* Colonne 3 - Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {data.services.map((service, idx) => (
                <li key={idx}>{service}</li>
              ))}
            </ul>
          </div>
          
          {/* Colonne 4 - Horaires */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Horaires</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {data.hours.map((hour, idx) => (
                <li key={idx}>{hour.day}: {hour.time}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {data.year || currentYear} {data.companyName}. {data.copyright}.</p>
          <p className="mt-2">{data.slogan}</p>
        </div>
      </div>
    </footer>
  )
}
