'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, Calendar, Users, Gift, Star, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function About() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const images = [
    { src: '/images/IMG-20260417-WA0038.jpg', alt: 'EYEANG Love - Fondatrice LoveExpress' },
    { src: '/images/IMG-20260417-WA0039.jpg', alt: 'EYEANG Love - Organisation de surprises' },
    { src: '/images/IMG-20260417-WA0040.jpg', alt: 'EYEANG Love - Créatrice de moments magiques' }
  ]

  // Rotation automatique toutes les 7 secondes
  useEffect(() => {
    if (isHovering) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 7000)
    
    return () => clearInterval(interval)
  }, [isHovering, images.length])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const stats = [
    { value: '98%', label: 'Clients satisfaits', icon: Users },
    { value: '100%', label: 'Passion et dévouement', icon: Heart },
    { value: '24/7', label: 'Disponibilité', icon: Clock },
    { value: 'Premium', label: 'Service exclusif', icon: Award }
  ]

  const qualities = [
    'Créativité illimitée',
    'Discrétion absolue',
    'Exécution parfaite',
    'Attention aux détails'
  ]

  return (
    <section className="py-24 bg-primaryLight">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Carrousel photo avec effet de fondu */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]">              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[currentImageIndex].src}
                    alt={images[currentImageIndex].alt}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Indicateur de progression (barre animée) */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 z-20">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 7, ease: "linear" }}
                  key={currentImageIndex}
                />
              </div>

              {/* Navigation flèches */}
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-primary transition-all duration-300 z-20 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-primary transition-all duration-300 z-20 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>

              {/* Indicateurs dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToImage(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      currentImageIndex === idx
                        ? 'w-8 h-2 bg-primary'
                        : 'w-2 h-2 bg-white/60 hover:bg-white/90'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Texte à propos */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Heart size={16} className="text-primary" />
              <span className="text-primary font-semibold text-sm">Notre histoire</span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
              Derrière chaque surprise, une passionnée
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Je m'appelle <span className="font-semibold text-dark">EYEANG Love</span>, fondatrice de LoveExpress. 
              Je transforme les moments ordinaires en souvenirs extraordinaires.
            </p>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Ce qui me motive chaque jour : voir l'étincelle dans les yeux 
              de ceux qui reçoivent une surprise et la joie de ceux qui offrent.
              Chaque projet est unique, chaque détail compte.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {qualities.map((quality, idx) => (
                <span key={idx} className="bg-white px-4 py-2 rounded-full text-sm text-dark shadow-sm">
                  {quality}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
                >
                  <stat.icon size={28} className="text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-dark">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
