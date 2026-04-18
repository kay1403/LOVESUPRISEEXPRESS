'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, Heart } from 'lucide-react'
import Link from 'next/link'

const realizations = [
  {
    url: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg',
    title: 'Demande en mariage surprise',
    category: 'Proposal'
  },
  {
    url: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg',
    title: 'Décoration anniversaire',
    category: 'Birthday'
  },
  {
    url: 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg',
    title: 'Ballons personnalisés',
    category: 'Decoration'
  },
  {
    url: 'https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg',
    title: 'Gift basket anniversaire',
    category: 'Gift Basket'
  },
  {
    url: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg',
    title: 'Teddy bear géant',
    category: 'Teddy Bear'
  },
  {
    url: 'https://images.pexels.com/photos/568500/pexels-photo-568500.jpeg',
    title: 'Bouquet de fleurs',
    category: 'Flowers'
  }
]

export default function Realizations() {
  const [selectedImage, setSelectedImage] = useState<typeof realizations[0] | null>(null)

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
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
              Nos Réalisations
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Découvrez nos dernières créations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realizations.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer group"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                    <p className="text-white font-semibold text-lg">{image.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bouton pour voir la galerie clients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              href="/gallery" 
              className="btn-secondary inline-flex items-center gap-2 group"
            >
              <Heart size={18} className="group-hover:fill-primary transition" />
              Avis Clients
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modal pour agrandir les réalisations */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-4xl w-full"
          >
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="w-full h-auto rounded-2xl"
            />
            <p className="text-white text-center mt-4 text-lg">{selectedImage.title}</p>
          </motion.div>
        </div>
      )}
    </>
  )
}
