'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const galleryImages = [
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

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null)

  return (
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
            Our Creations
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Découvrez nos dernières réalisations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
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
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white font-semibold text-lg">{image.title}</p>
                </div>
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
            <div className="max-w-4xl w-full">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title}
                className="w-full h-auto rounded-2xl"
              />
              <p className="text-white text-center mt-4 text-lg">{selectedImage.title}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
