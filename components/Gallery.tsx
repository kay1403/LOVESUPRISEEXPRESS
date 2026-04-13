'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { X, Heart, User, Calendar } from 'lucide-react'

// Ici ce sont les PHOTOS DES CLIENTS HEUREUX (preuve sociale)
const clientGallery = [
  {
    id: 1,
    url: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg',
    clientName: 'Marie & Jean',
    event: 'Demande en mariage',
    date: '15 Mars 2026',
    message: 'Merci LoveExpress pour ce moment magique ! ❤️'
  },
  {
    id: 2,
    url: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg',
    clientName: 'Sarah',
    event: 'Anniversaire 30 ans',
    date: '2 Avril 2026',
    message: 'Une décoration magnifique, tout le monde a adoré !'
  },
  {
    id: 3,
    url: 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg',
    clientName: 'David',
    event: 'Baby shower',
    date: '20 Mars 2026',
    message: 'Les ballons étaient parfaits, merci !'
  },
  {
    id: 4,
    url: 'https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg',
    clientName: 'Clarisse',
    event: 'Anniversaire surprise',
    date: '10 Avril 2026',
    message: 'Mon mari a été tellement surpris !'
  },
  {
    id: 5,
    url: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg',
    clientName: 'Alice & Thomas',
    event: 'Demande en mariage',
    date: '5 Avril 2026',
    message: 'Le meilleur jour de notre vie !'
  },
  {
    id: 6,
    url: 'https://images.pexels.com/photos/568500/pexels-photo-568500.jpeg',
    clientName: 'Maman de Kevin',
    event: 'Anniversaire 18 ans',
    date: '25 Mars 2026',
    message: 'Mon fils a adoré sa surprise !'
  }
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<typeof clientGallery[0] | null>(null)

  return (
    <section className="py-24 bg-primaryLight">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full mb-4">
            <Heart size={16} className="text-primary" />
            <span className="text-primary font-semibold text-sm">Ils nous ont fait confiance</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
            Galerie Clients
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Découvrez les sourires et la joie de nos clients après leurs surprises
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientGallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedImage(item)}
              className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.clientName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Heart size={40} className="text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-primary" />
                  <h3 className="font-semibold text-dark">{item.clientName}</h3>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-400">{item.date}</span>
                  <span className="text-xs text-primary ml-auto">{item.event}</span>
                </div>
                <p className="text-gray-600 text-sm italic">"{item.message}"</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.clientName}
                  className="w-full h-96 object-cover"
                />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <User size={18} className="text-primary" />
                  <h3 className="text-xl font-bold text-dark">{selectedImage.clientName}</h3>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{selectedImage.date}</span>
                  <span className="text-sm text-primary ml-auto">{selectedImage.event}</span>
                </div>
                <p className="text-gray-600 italic">"{selectedImage.message}"</p>
                <div className="mt-4 pt-4 border-t flex justify-center">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} size={16} className="fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}
