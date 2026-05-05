'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, Users, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface AboutImage {
  id: number
  src: string
  alt: string
  order: number
}

export default function About() {
  const { t } = useTranslation()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [images, setImages] = useState<AboutImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAboutImages()
  }, [])

  const fetchAboutImages = async () => {
    try {
      const response = await fetch('/api/cms/about-images')
      const data = await response.json()
      if (data.success && data.images && data.images.length > 0) {
        setImages(data.images)
      }
    } catch (error) {
      console.error('Erreur chargement images about:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loading || images.length === 0 || isHovering) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 7000)
    
    return () => clearInterval(interval)
  }, [isHovering, images.length, loading])

  useEffect(() => {
    if (loading || images.length === 0) return
    
    let loadedCount = 0
    images.forEach((image) => {
      const img = new Image()
      img.src = image.src
      img.onload = () => {
        loadedCount++
        if (loadedCount === images.length) {
          setImagesLoaded(true)
        }
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === images.length) {
          setImagesLoaded(true)
        }
      }
    })
  }, [images, loading])

  const nextImage = () => {
    if (images.length === 0) return
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    if (images.length === 0) return
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const stats = [
    { value: '98%', label: t('about.stats.satisfied'), icon: Users },
    { value: '100%', label: t('about.stats.passion'), icon: Heart },
    { value: '24/7', label: t('about.stats.availability'), icon: Clock },
    { value: 'Premium', label: t('about.stats.exclusive'), icon: Award }
  ]

  const qualities = [
    t('about.qualities.creativity'),
    t('about.qualities.discretion'),
    t('about.qualities.execution'),
    t('about.qualities.details')
  ]

  if (loading || !imagesLoaded) {
    return (
      <section className="py-24 bg-primaryLight">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] bg-gray-200 animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
              <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (images.length === 0) {
    return (
      <section className="py-24 bg-primaryLight">
        <div className="container-custom text-center">
          <p className="text-gray-500">{t('about.noImages')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-primaryLight">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Carrousel photo - inchangé (vient du CMS) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] bg-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={images[currentImageIndex].src}
                    alt={images[currentImageIndex].alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Erreur chargement image:', images[currentImageIndex].src)
                      e.currentTarget.src = '/images/placeholder.jpg'
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 z-20">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 7, ease: "linear" }}
                  key={currentImageIndex}
                />
              </div>

              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-primary transition-all duration-300 z-20 opacity-0 group-hover:opacity-100"
                aria-label="Image précédente"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-primary transition-all duration-300 z-20 opacity-0 group-hover:opacity-100"
                aria-label="Image suivante"
              >
                <ChevronRight size={20} />
              </button>

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
                    aria-label={`Aller à l'image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Texte à propos - TRADUIT via i18n */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Heart size={16} className="text-primary" />
              <span className="text-primary font-semibold text-sm">{t('about.ourStory')}</span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
              {t('about.title')}
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {t('about.description1')}
            </p>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {t('about.description2')}
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