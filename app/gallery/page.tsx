'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, X, Heart, User, Calendar, Star } from 'lucide-react'

// Tous les témoignages clients
const allTestimonials = [
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
  },
  {
    id: 4,
    url: 'https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg',
    clientName: 'Clarisse',
    event: 'Anniversaire surprise',
    date: '10 Avril 2026',
    message: 'Mon mari a été tellement surpris !',
    rating: 5
  },
  {
    id: 5,
    url: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg',
    clientName: 'Alice & Thomas',
    event: 'Demande en mariage',
    date: '5 Avril 2026',
    message: 'Le meilleur jour de notre vie !',
    rating: 5
  },
  {
    id: 6,
    url: 'https://images.pexels.com/photos/568500/pexels-photo-568500.jpeg',
    clientName: 'Maman de Kevin',
    event: 'Anniversaire 18 ans',
    date: '25 Mars 2026',
    message: 'Mon fils a adoré sa surprise !',
    rating: 5
  },
  {
    id: 7,
    url: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg',
    clientName: 'Paul & Sophie',
    event: 'Demande en mariage',
    date: '12 Avril 2026',
    message: 'Un moment inoubliable, merci encore !',
    rating: 5
  },
  {
    id: 8,
    url: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg',
    clientName: 'Isabelle',
    event: 'Anniversaire 50 ans',
    date: '8 Avril 2026',
    message: 'La décoration était magnifique !',
    rating: 5
  },
  {
    id: 9,
    url: 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg',
    clientName: 'Thomas',
    event: 'Fête de fiançailles',
    date: '1 Avril 2026',
    message: 'Tout était parfait, merci LoveExpress !',
    rating: 5
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.2, 0.9, 0.3, 1] }
  }
}

export default function GalleryPage() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<typeof allTestimonials[0] | null>(null)

  return (
    <main className="min-h-screen bg-primaryLight">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container-custom py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
            Retour à l'accueil
          </Link>
        </div>
      </div>

      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4 shadow-sm">
              <Heart size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Ils nous ont fait confiance</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-dark mb-4">
              Galerie Clients
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Découvrez les sourires et la joie de nos clients après leurs surprises
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {allTestimonials.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedTestimonial(item)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.clientName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={12} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Heart size={40} className="text-white drop-shadow-lg" />
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
                    <span className="text-xs text-primary ml-auto font-medium">{item.event}</span>
                  </div>
                  <p className="text-gray-600 text-sm italic line-clamp-2">"{item.message}"</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal */}
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
    </main>
  )
}
