'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Package, Heart, Baby, Coffee, Flower2, Sparkles, Gift } from 'lucide-react'

const giftBaskets = [
  {
    id: 1,
    name: 'Birthday',
    subtitle: 'Gift Basket',
    badge: 'Anniversaire',
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
    name: 'Romantic',
    subtitle: 'Gift Basket',
    badge: 'Saint-Valentin',
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
    name: 'New Baby',
    subtitle: 'Gift Basket',
    badge: 'Naissance',
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
    name: 'Gourmet',
    subtitle: 'Gift Basket',
    badge: 'Gastronomie',
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
    name: 'Wellness',
    subtitle: 'Gift Basket',
    badge: 'Bien-être',
    description: 'Relaxation and self-care',
    longDescription: 'Offrez un moment de détente avec ce panier bien-être. Produits de soin, huiles essentielles, et accessoires pour une pause relaxante.',
    price: 55000,
    priceRange: '55 000 - 85 000 RWF',
    image: 'https://images.pexels.com/photos/6521979/pexels-photo-6521979.jpeg',
    icon: Flower2,
    includes: ['Huiles essentielles', 'Bougies aromatiques', 'Masques de soin', 'Thé relaxant']
  }
]

// Variants d'animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.2, 0.9, 0.3, 1] }
  }
}

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
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Gift size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Cadeaux sur mesure</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
              Nos Panier Cadeaux
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Des cadeaux soigneusement sélectionnés pour chaque occasion
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {giftBaskets.map((basket, index) => (
              <motion.div
                key={basket.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedBasket(basket)}
                className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl border border-gray-100"
              >
                {/* Image avec overlay */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={basket.image} 
                    alt={basket.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-semibold text-primary">{basket.badge}</span>
                  </div>
                  
                  {/* Badge Popular */}
                  {basket.popular && (
                    <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={12} className="text-dark" />
                      <span className="text-xs font-semibold text-dark">Populaire</span>
                    </div>
                  )}
                  
                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold bg-primary/90 px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Voir le panier →
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <basket.icon size={16} className="text-primary" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-xl font-bold text-dark">{basket.name}</h3>
                      <span className="text-sm font-light text-gray-400">{basket.subtitle}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{basket.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">À partir de</p>
                      <span className="text-primary font-bold">{basket.priceRange.split(' - ')[0]}</span>
                    </div>
                    <button className="text-primary font-semibold text-sm hover:text-accent transition flex items-center gap-1">
                      Détails →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal Gift Basket */}
      <AnimatePresence>
        {selectedBasket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedBasket(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-56">
                <img src={selectedBasket.image} alt={selectedBasket.name} className="w-full h-full object-cover rounded-t-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button 
                  onClick={() => setSelectedBasket(null)} 
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition"
                >
                  <X size={20} className="text-white" />
                </button>
                {selectedBasket.popular && (
                  <div className="absolute top-4 left-4 bg-accent px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={12} className="text-dark" />
                    <span className="text-xs font-semibold text-dark">Plus populaire</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                    <selectedBasket.icon size={12} className="text-white" />
                    <span className="text-xs font-medium text-white uppercase tracking-wider">{selectedBasket.badge}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    {selectedBasket.name} {selectedBasket.subtitle}
                  </h3>
                  <p className="text-white/80 mt-1">{selectedBasket.priceRange}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                <p className="text-gray-600 leading-relaxed">{selectedBasket.longDescription}</p>
                
                <div className="bg-primaryLight rounded-xl p-5">
                  <h4 className="font-semibold text-dark mb-3 flex items-center gap-2">
                    <Package size={18} className="text-primary" />
                    Contenu du panier
                  </h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedBasket.includes.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="text-primary">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">À partir de</p>
                    <p className="text-2xl font-bold text-primary">{selectedBasket.priceRange}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedBasket(null)
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                  >
                    Commander <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
