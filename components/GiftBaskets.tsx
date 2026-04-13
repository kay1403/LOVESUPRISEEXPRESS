'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { X, Package, Heart, Baby, Coffee, Flower2, Sparkles } from 'lucide-react'

const giftBaskets = [
  {
    id: 1,
    name: 'Birthday Gift Basket',
    description: 'Perfect for birthday celebrations',
    longDescription: 'Un panier d\'anniversaire rempli de surprises : douceurs, accessoires de fête et cadeaux personnalisés pour célébrer comme il se doit.',
    price: 50000,
    priceRange: '50 000 - 80 000 RWF',
    image: 'https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg',
    icon: Package,
    includes: ['Gâteau personnalisé', 'Bougies', 'Petits cadeaux', 'Carte d\'anniversaire']
  },
  {
    id: 2,
    name: 'Romantic Gift Basket',
    description: 'For your special someone',
    longDescription: 'Un panier romantique pour déclarer votre flamme ou célébrer votre amour. Bougies parfumées, chocolats fins, et une attention particulière pour chaque détail.',
    price: 75000,
    priceRange: '75 000 - 120 000 RWF',
    image: 'https://images.pexels.com/photos/6521976/pexels-photo-6521976.jpeg',
    popular: true,
    icon: Heart,
    includes: ['Champagne', 'Chocolats belges', 'Bougies parfumées', 'Pétales de roses']
  },
  {
    id: 3,
    name: 'New Baby Gift Basket',
    description: 'Welcome the little one',
    longDescription: 'Célébrez l\'arrivée du nouveau-né avec ce panier cadeau rempli d\'articles essentiels pour bébé et des surprises pour les nouveaux parents.',
    price: 45000,
    priceRange: '45 000 - 70 000 RWF',
    image: 'https://images.pexels.com/photos/6521977/pexels-photo-6521977.jpeg',
    icon: Baby,
    includes: ['Body et accessoires bébé', 'Peluche', 'Couvertures', 'Carte de félicitations']
  },
  {
    id: 4,
    name: 'Gourmet Gift Basket',
    description: 'For food lovers',
    longDescription: 'Un voyage gustatif pour les amateurs de bonne cuisine. Produits fins, spécialités locales et internationales, le bonheur des papilles.',
    price: 65000,
    priceRange: '65 000 - 100 000 RWF',
    image: 'https://images.pexels.com/photos/6521978/pexels-photo-6521978.jpeg',
    icon: Coffee,
    includes: ['Café premium', 'Thé rare', 'Confiseries fines', 'Épices du monde']
  },
  {
    id: 5,
    name: 'Wellness Gift Basket',
    description: 'Relaxation and self-care',
    longDescription: 'Offrez un moment de détente avec ce panier bien-être. Produits de soin, huiles essentielles, et accessoires pour une pause relaxante.',
    price: 55000,
    priceRange: '55 000 - 85 000 RWF',
    image: 'https://images.pexels.com/photos/6521979/pexels-photo-6521979.jpeg',
    icon: Flower2,
    includes: ['Huiles essentielles', 'Bougies aromatiques', 'Masques de soin', 'Thé relaxant']
  }
]

export default function GiftBaskets() {
  const [selectedBasket, setSelectedBasket] = useState<typeof giftBaskets[0] | null>(null)

  return (
    <>
      <section className="py-24 bg-primaryLight">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
              Our Gift Baskets
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Carefully curated gifts for every occasion
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giftBaskets.map((basket, index) => (
              <motion.div
                key={basket.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedBasket(basket)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer relative transition-all duration-300 hover:shadow-2xl"
              >
                {basket.popular && (
                  <div className="absolute top-4 right-4 bg-accent text-dark px-3 py-1 rounded-full text-sm font-semibold z-10 flex items-center gap-1">
                    <Sparkles size={14} /> Popular
                  </div>
                )}
                <div className="h-64 overflow-hidden">
                  <img 
                    src={basket.image} 
                    alt={basket.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <basket.icon size={20} className="text-primary" />
                    <h3 className="text-xl font-bold text-dark">{basket.name}</h3>
                  </div>
                  <p className="text-gray-500 mb-4">{basket.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">{basket.priceRange}</span>
                    <button className="text-primary font-semibold hover:text-accent transition flex items-center gap-1">
                      Voir détails →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Gift Basket */}
      {selectedBasket && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBasket(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56">
              <img src={selectedBasket.image} alt={selectedBasket.name} className="w-full h-full object-cover rounded-t-2xl" />
              <button onClick={() => setSelectedBasket(null)} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full">
                <X size={20} />
              </button>
              {selectedBasket.popular && (
                <div className="absolute top-4 left-4 bg-accent text-dark px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Sparkles size={14} /> Plus populaire
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <selectedBasket.icon size={24} className="text-primary" />
                <h3 className="text-2xl font-bold text-dark">{selectedBasket.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{selectedBasket.longDescription}</p>
              <div className="bg-primaryLight p-4 rounded-xl mb-4">
                <h4 className="font-semibold text-dark mb-2">Contenu du panier :</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {selectedBasket.includes.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="text-primary">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">À partir de</p>
                  <p className="text-2xl font-bold text-primary">{selectedBasket.priceRange}</p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedBasket(null)
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="btn-primary"
                >
                  Commander
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
