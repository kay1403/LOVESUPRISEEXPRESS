'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-2xl font-bold text-primary mb-4">
              LoveExpress
            </h3>
            <p className="text-gray-400 text-sm">
              We deliver love and kindness. Creons ensemble des moments inoubliables.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Tel: +250 799 366 007</li>
              <li>Tel: +250 737 769 092</li>
              <li>Kigali, Rwanda</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Balloons & Helium</li>
              <li>Party Decoration</li>
              <li>Surprise Planner</li>
              <li>Gift Baskets</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Horaires</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Lundi - Samedi: 9h - 19h</li>
              <li>Dimanche: Sur rendez-vous</li>
              <li>Livraison 24/24 sur demande</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} LoveExpress. Tous droits reserves.</p>
          <p className="mt-2">We deliver love and kindness</p>
        </div>
      </div>
    </footer>
  )
}
