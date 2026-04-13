'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { X, Heart, User, Calendar, ArrowRight, Star } from 'lucide-react'

// Témoignages clients (aperçu sur la page d'accueil)
const testimonials = [
  {
    id: 1,
    url: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg',
    clientName: 'Marie & Jean',
    event: 'Demande en mariage',
    date: '15 Mars 2026',
    message: 'Merci LoveExpress pour ce moment magique !',
    rating: 5
  },
  {
    id: 2,
    url: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg',
    clientName: 'Sarah',
    event: 'Anniversaire 30 ans',
    date: '2 Avril 2026',
    message: 'Une décoration magnifique, tout le monde a adoré !',
    rating: 5
  },
  {
    id: 3,
    url: 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg',
    clientName: 'David',
    event: 'Baby shower',
    date: '20 Mars 2026',
    message: 'Les ballons étaient parfaits, merci !',
    rating: 5
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

export default function Gallery() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<typeof testimonials[0] | null>(null)

  return (
    <>
      <section className="py-24 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Heart size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Témoignages</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
              Ils nous ont fait confiance
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Découvrez les sourires et la joie de nos clients après leurs surprises
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {testimonials.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedTestimonial(item)}
                className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.clientName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Rating */}
                  <div className="absolute bottom-4 left-4 flex gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-accent text-accent" />
                    ))}
                  </div>
                  
                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Heart size={48} className="text-white drop-shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={14} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-dark">{item.clientName}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{item.date}</span>
                    <span className="text-xs text-primary ml-auto">{item.event}</span>
                  </div>
                  <p className="text-gray-600 text-sm italic line-clamp-2">"{item.message}"</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bouton pour voir toute la galerie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              href="/gallery" 
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 group"
            >
              Voir tous les témoignages
              <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modal pour agrandir le témoignage */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTestimonial(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img 
                  src={selectedTestimonial.url} 
                  alt={selectedTestimonial.clientName}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button 
                  onClick={() => setSelectedTestimonial(null)}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition"
                >
                  <X size={20} className="text-white" />
                </button>
                <div className="absolute bottom-4 left-4 flex gap-0.5">
                  {[...Array(selectedTestimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark">{selectedTestimonial.clientName}</h3>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{selectedTestimonial.date}</span>
                    </div>
                  </div>
                  <span className="ml-auto text-sm text-primary font-medium">{selectedTestimonial.event}</span>
                </div>
                <p className="text-gray-600 italic text-lg leading-relaxed">"{selectedTestimonial.message}"</p>
                <div className="mt-6 pt-4 border-t flex justify-center">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} size={16} className="fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
