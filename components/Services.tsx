'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
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

type Service = {
  id: number
  title: string
  subtitle: string
  badge: string
  description: string
  longDescription: string
  basePrice: number
  priceRange: string
  image: string
  packs?: ServicePack[]
  includes: string[]
  options: ServiceOption[]
  duration: string
  coverage: string
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/cms/services')
      const data = await response.json()
      if (data.success && data.services) {
        setServices(data.services)
      }
    } catch (error) {
      console.error('Erreur chargement services:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'party': return PartyPopper
      case 'surprise': return Sparkles
      case 'custom': return Globe
      case 'flower': return Flower2
      case 'gift': return Gift
      default: return Sparkles
    }
  }

  if (loading) {
    return (
      <section id="services" className="py-24 bg-white">
        <div className="container-custom text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    )
  }

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = getIcon(service.title)
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (service.id - 1) * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedService(service)}
                  className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full">
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
                        <Icon size={18} className="text-primary" />
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
              )
            })}
          </div>
        </div>
      </section>

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
              transition={{ type: "spring", damping: 25 }} 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64">
                <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition">
                  <X size={20} className="text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-3">
                    <span className="text-xs font-medium text-white uppercase tracking-wider">{selectedService.badge}</span>
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white">
                    {selectedService.title} {selectedService.subtitle}
                  </h3>
                  <p className="text-white/80 mt-1">{selectedService.priceRange}</p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-dark mb-3">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedService.longDescription}</p>
                </div>
                
                {selectedService.packs && selectedService.packs.length > 0 && (
                  <div className="bg-primaryLight rounded-xl p-5">
                    <h4 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
                      <Sparkles size={20} className="text-primary" />
                      Nos Packs Décoration
                    </h4>
                    <div className="space-y-3">
                      {selectedService.packs.map((pack, idx) => (
                        <div key={idx} className="border-b border-white/50 pb-3 last:border-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-dark">{pack.name}</span>
                            <span className="text-primary font-bold">{pack.price.toLocaleString()} RWF</span>
                          </div>
                          <p className="text-sm text-gray-600">{pack.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-primaryLight rounded-xl p-5">
                    <h4 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
                      <Check size={20} className="text-primary" />
                      Inclus
                    </h4>
                    <ul className="space-y-2">
                      {selectedService.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                          <Check size={14} className="text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedService.options && selectedService.options.length > 0 && (
                    <div className="bg-primaryLight rounded-xl p-5">
                      <h4 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
                        <CreditCard size={20} className="text-primary" />
                        Options
                      </h4>
                      <ul className="space-y-2">
                        {selectedService.options.map((option, idx) => (
                          <li key={idx} className="flex justify-between items-center text-gray-600 text-sm">
                            <span>{option.name}</span>
                            {option.price > 0 ? (
                              <span className="text-primary font-semibold">+{option.price.toLocaleString()} RWF</span>
                            ) : option.note ? (
                              <span className="text-xs text-gray-400">{option.note}</span>
                            ) : (
                              <span className="text-green-600 text-xs">Inclus</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-5 bg-gradient-to-r from-primary/5 to-primaryLight rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Préparation</p>
                      <p className="font-semibold text-dark text-sm">{selectedService.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Couverture</p>
                      <p className="font-semibold text-dark text-sm">{selectedService.coverage}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => { 
                      setSelectedService(null); 
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); 
                    }} 
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition"
                  >
                    Demander un devis
                  </button>
                  <button 
                    onClick={() => setSelectedService(null)} 
                    className="px-6 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-semibold hover:border-primary hover:text-primary transition"
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
