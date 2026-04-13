'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const previewImages = [
  { url: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg', title: 'Demande en mariage' },
  { url: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg', title: 'Décoration anniversaire' },
  { url: 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg', title: 'Ballons personnalisés' },
  { url: 'https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg', title: 'Gift basket' },
]

export default function GallerySection() {
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
            Our Realizations
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Discover the magic we've created for our clients
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previewImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-pointer overflow-hidden rounded-xl"
            >
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{image.title}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link 
            href="/gallery" 
            className="btn-secondary inline-flex items-center gap-2"
          >
            Voir toute la galerie <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
