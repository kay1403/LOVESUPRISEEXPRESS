'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Package, Heart, Baby, Coffee, Flower2, Sparkles, Gift, Check } from 'lucide-react'

const giftBaskets = [
  {
    id: 1, name: 'Birthday', subtitle: 'Gift Basket', badge: 'Anniversaire',
    description: 'Pour un anniversaire inoubliable',
    longDescription: 'Mini gâteau d\'anniversaire, bougie, carte personnalisée, jus de fruit.',
    priceStandard: 15000, pricePremium: 80000, priceRange: '15 000 - 80 000 RWF',
    image: 'https://i.pinimg.com/1200x/ec/36/e4/ec36e470b8d41448d810491847893f83.jpg',
    popular: true, icon: Package,
    includes: ['Mini gâteau anniversaire', 'Bougie', 'Carte personnalisée', 'Jus de fruit']
  },
  {
    id: 2, name: 'Romantic', subtitle: 'Gift Basket', badge: 'Romantique',
    description: 'Pour votre moitié',
    longDescription: 'Chocolat, bougies parfumées, lettre d\'amour, bouquet de fleurs.',
    priceStandard: 40000, pricePremium: 50000, priceRange: '40 000 - 50 000 RWF',
    image: 'https://i.pinimg.com/736x/63/a7/09/63a709e557275506ec67b31b59642c44.jpg',
    popular: true, icon: Heart,
    includes: ['Chocolat', 'Bougies parfumées', 'Lettre d\'amour', 'Bouquet de fleurs']
  },
  {
    id: 3, name: 'New Baby', subtitle: 'Gift Basket', badge: 'Naissance',
    description: 'Bienvenue au nouveau-né',
    longDescription: 'Vêtements bébé, couches, produits de soin, doudou.',
    priceStandard: 40000, pricePremium: 80000, priceRange: '40 000 - 80 000 RWF',
    image: 'https://i.pinimg.com/1200x/48/b0/79/48b07903362683f89724cc49e705a008.jpg',
    popular: false, icon: Baby,
    includes: ['Vêtements bébé', 'Couches', 'Produits de soin', 'Doudou']
  },
  {
    id: 4, name: 'Gourmet', subtitle: 'Gift Basket', badge: 'Gastronomie',
    description: 'Pour les gourmands',
    longDescription: 'Biscuits, fruits, chocolat, jus, bonbons.',
    priceStandard: 20000, pricePremium: 70000, priceRange: '20 000 - 70 000 RWF',
    image: 'https://i.pinimg.com/1200x/5d/1c/43/5d1c43fa44d4ceec1d095ce415241b0a.jpg',
    popular: true, icon: Coffee,
    includes: ['Biscuits', 'Fruits', 'Chocolat', 'Jus', 'Bonbons']
  },
  {
    id: 5, name: 'Wellness', subtitle: 'Gift Basket', badge: 'Bien-être',
    description: 'Détente et bien-être',
    longDescription: 'Thé, huiles essentielles, savon, masques visage, parfum, crème.',
    priceStandard: 50000, pricePremium: 100000, priceRange: '50 000 - 100 000 RWF',
    image: 'https://i.pinimg.com/1200x/fe/c3/97/fec397b6fbc634e851457411b107e4c5.jpg',
    popular: false, icon: Flower2,
    includes: ['Thé', 'Huiles essentielles', 'Savon', 'Masques visage', 'Parfum', 'Crème']
  }
]

export default function GiftBaskets() {
  const [selectedBasket, setSelectedBasket] = useState<typeof giftBaskets[0] | null>(null)

  return (
    <>
      <section className="py-24 bg-primaryLight">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Gift size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Cadeaux sur mesure</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">Nos Paniers Cadeaux</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Des cadeaux soigneusement sélectionnés pour chaque occasion</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giftBaskets.map((basket, index) => (
              <motion.div
                key={basket.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedBasket(basket)}
                className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={basket.image} alt={basket.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-semibold text-primary">{basket.badge}</span>
                  </div>
                  {basket.popular && (
                    <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={12} className="text-dark" />
                      <span className="text-xs font-semibold text-dark">Populaire</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold bg-primary/90 px-5 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Voir le panier
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <basket.icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark">{basket.name}</h3>
                      <p className="text-xs text-gray-400">{basket.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{basket.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-primary font-bold">{basket.priceStandard.toLocaleString()} RWF</span>
                    <button className="text-primary text-sm font-medium hover:text-accent transition">Détails</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedBasket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedBasket(null)}>
            <motion.div initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 50, opacity: 0 }} transition={{ type: "spring", damping: 25 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative h-56">
                <img src={selectedBasket.image} alt={selectedBasket.name} className="w-full h-full object-cover rounded-t-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button onClick={() => setSelectedBasket(null)} className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition"><X size={20} className="text-white" /></button>
                {selectedBasket.popular && (<div className="absolute top-4 left-4 bg-accent px-3 py-1 rounded-full flex items-center gap-1"><Sparkles size={12} className="text-dark" /><span className="text-xs font-semibold text-dark">Populaire</span></div>)}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                    <selectedBasket.icon size={12} className="text-white" />
                    <span className="text-xs font-medium text-white uppercase tracking-wider">{selectedBasket.badge}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">{selectedBasket.name} {selectedBasket.subtitle}</h3>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <p className="text-gray-600 leading-relaxed">{selectedBasket.longDescription}</p>
                <div className="bg-primaryLight rounded-xl p-5">
                  <h4 className="font-semibold text-dark mb-3 flex items-center gap-2"><Package size={18} className="text-primary" />Contenu du panier</h4>
                  <ul className="grid grid-cols-2 gap-2">{selectedBasket.includes.map((item, idx) => (<li key={idx} className="flex items-center gap-2 text-gray-600 text-sm"><Check size={14} className="text-primary" />{item}</li>))}</ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-xl p-3 text-center"><p className="text-xs text-gray-500">Standard</p><p className="text-xl font-bold text-primary">{selectedBasket.priceStandard.toLocaleString()} RWF</p></div>
                  <div className="border rounded-xl p-3 text-center bg-gradient-to-r from-primary/5 to-primaryLight"><p className="text-xs text-gray-500">Premium</p><p className="text-xl font-bold text-primary">{selectedBasket.pricePremium.toLocaleString()} RWF</p></div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div><p className="text-sm text-gray-500">À partir de</p><p className="text-2xl font-bold text-primary">{selectedBasket.priceStandard.toLocaleString()} RWF</p></div>
                  <button onClick={() => { setSelectedBasket(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition">Commander</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
