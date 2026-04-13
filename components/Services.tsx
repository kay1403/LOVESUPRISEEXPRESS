'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Info, Sparkles, Clock, MapPin, CreditCard, Heart } from 'lucide-react'

const services = [
  {
    id: 1,
    title: "Balloons",
    subtitle: "& Helium",
    badge: "Service Premium",
    description: 'Balloon accessories and helium gas for all events',
    longDescription: 'Transformez n\'importe quel espace en un lieu magique avec nos ballons personnalisés. Nous proposons une large gamme de ballons de toutes les couleurs, formes et tailles, avec remplissage à l\'hélium pour un effet flottant spectaculaire.',
    basePrice: 35000,
    priceRange: '25 000 - 80 000 RWF',
    image: 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg',
    includes: [
      'Ballons latex et aluminium',
      'Remplissage hélium',
      'Poids pour maintien au sol',
      'Livraison sur place'
    ],
    options: [
      { name: 'Ballon géant personnalisé', price: 15000 },
      { name: 'Pack 50 ballons', price: 45000 },
      { name: 'Ballons à message imprimé', price: 5000 }
    ],
    duration: '2-4 heures',
    coverage: 'Kigali et environs'
  },
  {
    id: 2,
    title: "Party",
    subtitle: "Decoration",
    badge: "Art & Élégance",
    description: 'Complete decoration for birthdays, weddings, and more',
    longDescription: 'Une décoration d\'événement complète et personnalisée selon votre thème. Nous prenons en charge l\'installation complète et le démontage après l\'événement.',
    basePrice: 50000,
    priceRange: '40 000 - 150 000 RWF',
    image: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg',
    includes: [
      'Nappes et housses de chaise',
      'Centres de table',
      'Guirlandes lumineuses',
      'Bannières personnalisées'
    ],
    options: [
      { name: 'Fond de scène personnalisé', price: 35000 },
      { name: 'Ballon arch (entrée)', price: 45000 },
      { name: 'Pack confettis et serpentins', price: 8000 }
    ],
    duration: '4-8 heures',
    coverage: 'Kigali et environs'
  },
  {
    id: 3,
    title: "Surprise",
    subtitle: "Planner",
    badge: "Expert en émotions",
    description: 'We organize everything for the perfect surprise',
    longDescription: 'Vous avez l\'idée, nous exécutons. Notre service de planification de surprise prend en charge TOUS les détails : logistique, coordination, timing, et même la complicité des invités.',
    basePrice: 75000,
    priceRange: '65 000 - 250 000 RWF',
    image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg',
    includes: [
      'Consultation et planification',
      'Coordination avec tous les prestataires',
      'Timing et discrétion garantis',
      'Photo et vidéo (optionnel)'
    ],
    options: [
      { name: 'Photographe professionnel', price: 50000 },
      { name: 'Violoniste / Musicien', price: 60000 },
      { name: 'Garde d\'enfants sur place', price: 25000 }
    ],
    duration: 'Planification 1-2 semaines',
    coverage: 'Tout le Rwanda'
  },
  {
    id: 4,
    title: "Custom",
    subtitle: "Website",
    badge: "Digital & Créatif",
    description: 'Personalized website for your event or business',
    longDescription: 'Créez un site web personnalisé pour votre événement : site d\'anniversaire surprise, site de mariage avec RSVP, ou site vitrine pour votre commerce. Un cadeau numérique unique et durable.',
    basePrice: 85000,
    priceRange: '85 000 - 300 000 RWF',
    image: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg',
    includes: [
      'Design personnalisé',
      'Hébergement 1 an inclus',
      'Nom de domaine personnalisé',
      'Support technique 3 mois'
    ],
    options: [
      { name: 'Page de collecte de photos', price: 20000 },
      { name: 'Compte à rebours animé', price: 15000 },
      { name: 'Galerie vidéo', price: 25000 }
    ],
    duration: '5-10 jours ouvrés',
    coverage: '100% en ligne'
  },
  {
    id: 5,
    title: "Flower",
    subtitle: "Bouquet",
    badge: "Frais & Élégant",
    description: 'Fresh and elegant flower arrangements',
    longDescription: 'Des bouquets de fleurs fraîches soigneusement sélectionnés et arrangés par nos fleuristes. Parfait pour accompagner toute surprise ou comme cadeau principal.',
    basePrice: 20000,
    priceRange: '15 000 - 60 000 RWF',
    image: 'https://images.pexels.com/photos/568500/pexels-photo-568500.jpeg',
    includes: [
      'Fleurs fraîches de saison',
      'Emballage élégant',
      'Carte personnalisée',
      'Livraison offerte en ville'
    ],
    options: [
      { name: 'Bouquet premium roses rouges', price: 25000 },
      { name: 'Ballon avec bouquet', price: 15000 },
      { name: 'Livraison express (2h)', price: 5000 }
    ],
    duration: '2 heures',
    coverage: 'Kigali'
  },
  {
    id: 6,
    title: "Gift",
    subtitle: "Baskets",
    badge: "Luxe & Douceur",
    description: 'Luxury curated gift baskets for all occasions',
    longDescription: 'Des paniers cadeaux luxueux soigneusement composés selon l\'occasion et les goûts de la personne. Chaque panier est unique et personnalisable.',
    basePrice: 45000,
    priceRange: '35 000 - 120 000 RWF',
    image: 'https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg',
    includes: [
      'Panier premium',
      'Produits de qualité',
      'Carte personnalisée',
      'Emballage cadeau'
    ],
    options: [
      { name: 'Ajout de chocolats belges', price: 12000 },
      { name: 'Ajout de vin / champagne', price: 25000 },
      { name: 'Livraison nocturne', price: 8000 }
    ],
    duration: '1-2 jours',
    coverage: 'Tout le Rwanda'
  }
]

// Variants d'animation pour l'apparition au scroll
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
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Ce que nous faisons</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
              Nos Services
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour créer le moment de surprise parfait
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedService(service)}
                className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl border border-gray-100"
              >
                {/* Image avec overlay gradient */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-semibold text-primary">{service.badge}</span>
                  </div>
                  
                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold bg-primary/90 px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Découvrir →
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-baseline gap-1 mb-2">
                    <h3 className="text-xl font-bold text-dark">{service.title}</h3>
                    <span className="text-lg font-light text-gray-400">{service.subtitle}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{service.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">À partir de</p>
                      <span className="text-primary font-bold">{service.priceRange.split(' - ')[0]}</span>
                    </div>
                    <button className="text-primary font-semibold text-sm hover:text-accent transition flex items-center gap-1">
                      Détails <Info size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal des détails du service */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête du modal */}
              <div className="relative h-64">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition"
                >
                  <X size={20} className="text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                    <span className="text-xs font-medium text-white uppercase tracking-wider">{selectedService.badge}</span>
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white">
                    {selectedService.title} {selectedService.subtitle}
                  </h3>
                  <p className="text-white/80 mt-1">{selectedService.priceRange}</p>
                </div>
              </div>

              {/* Contenu du modal */}
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-dark mb-3">Description détaillée</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedService.longDescription}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-primaryLight rounded-xl p-5">
                    <h4 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
                      <Sparkles size={20} className="text-primary" />
                      Ce qui est inclus
                    </h4>
                    <ul className="space-y-2">
                      {selectedService.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                          <span className="text-primary">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-primaryLight rounded-xl p-5">
                    <h4 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
                      <CreditCard size={20} className="text-primary" />
                      Options supplémentaires
                    </h4>
                    <ul className="space-y-2">
                      {selectedService.options.map((option, idx) => (
                        <li key={idx} className="flex justify-between items-center text-gray-600 text-sm">
                          <span>{option.name}</span>
                          <span className="text-primary font-semibold">+{option.price.toLocaleString()} RWF</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-5 bg-gradient-to-r from-primary/5 to-primaryLight rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Durée de préparation</p>
                      <p className="font-semibold text-dark text-sm">{selectedService.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Zone de couverture</p>
                      <p className="font-semibold text-dark text-sm">{selectedService.coverage}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => {
                      setSelectedService(null)
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
                  >
                    Demander un devis
                  </button>
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="px-6 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-semibold hover:border-primary hover:text-primary transition-all duration-300"
                  >
                    Fermer
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
