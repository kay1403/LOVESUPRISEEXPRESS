'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowRight, Heart } from 'lucide-react'
import Link from 'next/link'

interface Realisation {
  id: number
  title: string
  category: string
  image: string
}

export default function Realizations() {
  const [realizations, setRealisations] = useState<Realisation[]>([])
  const [selectedImage, setSelectedImage] = useState<Realisation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRealisations()
  }, [])

  const fetchRealisations = async () => {
    try {
      const response = await fetch('/api/cms/realisations')
      const data = await response.json()
      if (data.success && data.realisations) {
        setRealisations(data.realisations)
      }
    } catch (error) {
      console.error('Erreur chargement réalisations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="container-custom text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    )
  }

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
                key={image.id}
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
                    src={image.image}
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
              src={selectedImage.image} 
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
