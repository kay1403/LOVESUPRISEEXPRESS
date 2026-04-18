'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Info, Sparkles, Clock, MapPin, CreditCard, Heart, Gift, Flower2, Globe, PartyPopper, Check } from 'lucide-react'

type ServiceOption = {
  name: string
  price: number
  note?: string
}

type ServicePack = {
  name: string
  price: number
  desc: string
}

const services = [
  {
    id: 1,
    title: "Party",
    subtitle: "Decoration",
    badge: "Pack Premier Frisson",
    description: 'The beauty of your events is prepared everyday',
    longDescription: 'Transformez n\'importe quel espace en un lieu magique. Décoration complète et personnalisée selon votre thème.',
    basePrice: 60000,
    priceRange: '60 000 RWF',
    image: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg',
    packs: [
      { name: 'Pack Premier Frisson', price: 60000, desc: '15 ballons, message au sol en pétale, 5 photos suspendues, LED ou bougie' },
      { name: 'Pack Love XL', price: 100000, desc: '25 ballons, lettre/chiffre lumineux, table dressée pour deux, bougie parfumée, playlist personnalisée' },
      { name: 'Pack ROYAL SURPRISE', price: 200000, desc: 'Rideau de ballons + néon personnalisé, plateau de fruits + vin, photographe 20 min, bouquet de fleurs' }
    ],
    includes: ['Installation complète', 'Décoration sur mesure', 'Démontage inclus', 'Discrétion garantie'],
    options: [] as ServiceOption[],
    duration: '4-8 heures',
    coverage: 'Kigali et environs',
    icon: PartyPopper
  },
  {
    id: 2,
    title: "Surprise",
    subtitle: "Planner",
    badge: "Expert en émotions",
    description: 'Dites nous l\'occasion et on planifie toute la surprise',
    longDescription: 'Vous avez l\'idée, nous exécutons. Notre service de planification de surprise prend en charge TOUS les détails : logistique, coordination, timing, et même la complicité des invités.',
    basePrice: 200000,
    priceRange: '200 000 RWF',
    image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg',
    includes: ['Consultation et planification', 'Coordination avec tous les prestataires', 'Timing et discrétion garantis', 'Présence sur place'],
    options: [
      { name: 'Photographe professionnel', price: 50000 },
      { name: 'Violoniste / Musicien', price: 60000 }
    ] as ServiceOption[],
    duration: '1-2 semaines',
    coverage: 'Tout le Rwanda',
    icon: Sparkles
  },
  {
    id: 3,
    title: "Custom",
    subtitle: "Website",
    badge: "Digital & Créatif",
    description: 'Site web personnalisé pour votre événement ou entreprise',
    longDescription: 'Créez un site web personnalisé pour votre événement : site d\'anniversaire surprise, site de mariage avec RSVP, ou site vitrine pour votre commerce.',
    basePrice: 25000,
    pricePremium: 45000,
    priceRange: '25 000 - 45 000 RWF',
    image: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg',
    includes: ['Design personnalisé', 'Hébergement 1 an inclus', 'Nom de domaine personnalisé', 'Support technique 3 mois'],
    options: [
      { name: 'Site simple (5 pages)', price: 25000 },
      { name: 'Site premium (illimité + blog)', price: 45000 },
      { name: 'Galerie photo', price: 20000 }
    ] as ServiceOption[],
    duration: '5-10 jours',
    coverage: '100% en ligne',
    icon: Globe
  },
  {
    id: 4,
    title: "Flower",
    subtitle: "Bouquet",
    badge: "Frais & Élégant",
    description: 'Pour tout événement - Bouquet personnalisable',
    longDescription: 'Des bouquets de fleurs fraîches soigneusement sélectionnés. Parfait pour accompagner toute surprise. Le client peut adapter son montant.',
    basePrice: 15000,
    priceRange: '15 000 RWF',
    image: 'https://images.pexels.com/photos/568500/pexels-photo-568500.jpeg',
    includes: ['Fleurs fraîches de saison', 'Emballage élégant', 'Carte personnalisée', 'Livraison offerte'],
    options: [
      { name: 'Bouquet premium roses rouges', price: 25000 },
      { name: 'Livraison express (2h)', price: 5000 },
      { name: 'Personnalisation du montant', price: 0, note: 'À partir de 15 000 RWF' }
    ] as ServiceOption[],
    duration: '2 heures',
    coverage: 'Kigali',
    icon: Flower2
  },
  {
    id: 5,
    title: "Gift",
    subtitle: "Baskets",
    badge: "Luxe & Douceur",
    description: 'Paniers cadeaux personnalisables pour toutes les occasions',
    longDescription: 'Des paniers cadeaux luxueux soigneusement composés selon l\'occasion et les goûts de la personne. Chaque panier est unique.',
    basePrice: 15000,
    priceRange: '15 000 - 100 000 RWF',
    image: 'https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg',
    includes: ['Panier premium', 'Produits de qualité', 'Carte personnalisée', 'Emballage cadeau'],
    options: [
      { name: 'Ajout de chocolats belges', price: 12000 },
      { name: 'Ajout de champagne', price: 25000 },
      { name: 'Livraison nocturne', price: 8000 }
    ] as ServiceOption[],
    duration: '1-2 jours',
    coverage: 'Tout le Rwanda',
    icon: Gift
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.9, 0.3, 1] } }
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null)

  return (
    <>
      <section id="services" className="py-24 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Heart size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Nos Prestations</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">Nos Services</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Tout ce dont vous avez besoin pour créer le moment de surprise parfait</p>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedService(service)}
                className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-semibold text-primary">{service.badge}</span>
                  </div>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold bg-primary/90 px-5 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Découvrir
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {service.icon && <service.icon size={18} className="text-primary" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark">{service.title}</h3>
                      <p className="text-xs text-gray-400">{service.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-primary font-bold">{service.priceRange}</span>
                    <button className="text-primary text-sm font-medium hover:text-accent transition flex items-center gap-1">
                      Détails <Info size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedService && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedService(null)}>
            <motion.div initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 50, opacity: 0 }} transition={{ type: "spring", damping: 25 }} className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative h-64">
                <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition"><X size={20} className="text-white" /></button>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                    <span className="text-xs font-medium text-white uppercase tracking-wider">{selectedService.badge}</span>
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white">{selectedService.title} {selectedService.subtitle}</h3>
                  <p className="text-white/80 mt-1">{selectedService.priceRange}</p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div><h4 className="text-xl font-semibold text-dark mb-3">Description</h4><p className="text-gray-600 leading-relaxed">{selectedService.longDescription}</p></div>
                {selectedService.packs && selectedService.packs.length > 0 && (
                  <div className="bg-primaryLight rounded-xl p-5">
                    <h4 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2"><Sparkles size={20} className="text-primary" />Nos Packs Décoration</h4>
                    <div className="space-y-3">
                      {selectedService.packs.map((pack, idx) => (
                        <div key={idx} className="border-b border-white/50 pb-3 last:border-0">
                          <div className="flex justify-between items-center mb-1"><span className="font-bold text-dark">{pack.name}</span><span className="text-primary font-bold">{pack.price.toLocaleString()} RWF</span></div>
                          <p className="text-sm text-gray-600">{pack.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-primaryLight rounded-xl p-5">
                    <h4 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2"><Check size={20} className="text-primary" />Inclus</h4>
                    <ul className="space-y-2">{selectedService.includes.map((item, idx) => (<li key={idx} className="flex items-center gap-2 text-gray-600 text-sm"><Check size={14} className="text-primary" />{item}</li>))}</ul>
                  </div>
                  {selectedService.options && selectedService.options.length > 0 && (
                    <div className="bg-primaryLight rounded-xl p-5">
                      <h4 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2"><CreditCard size={20} className="text-primary" />Options</h4>
                      <ul className="space-y-2">{selectedService.options.map((option, idx) => (<li key={idx} className="flex justify-between items-center text-gray-600 text-sm"><span>{option.name}</span>{option.price > 0 ? <span className="text-primary font-semibold">+{option.price.toLocaleString()} RWF</span> : option.note ? <span className="text-xs text-gray-400">{option.note}</span> : <span className="text-green-600 text-xs">Inclus</span>}</li>))}</ul>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 p-5 bg-gradient-to-r from-primary/5 to-primaryLight rounded-xl">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Clock size={20} className="text-primary" /></div><div><p className="text-xs text-gray-500">Préparation</p><p className="font-semibold text-dark text-sm">{selectedService.duration}</p></div></div>
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><MapPin size={20} className="text-primary" /></div><div><p className="text-xs text-gray-500">Couverture</p><p className="font-semibold text-dark text-sm">{selectedService.coverage}</p></div></div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => { setSelectedService(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex-1 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition">Demander un devis</button>
                  <button onClick={() => setSelectedService(null)} className="px-6 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-semibold hover:border-primary hover:text-primary transition">Fermer</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
