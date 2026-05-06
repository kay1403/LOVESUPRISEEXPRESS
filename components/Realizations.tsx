// components/Realizations.tsx (version mise à jour)
'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Heart, ChevronDown, Play, X } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface Realisation {
  id: number
  title: string
  category: string
  mediaType: 'image' | 'video'
  image?: string
  video?: string
  thumbnail?: string
}

export default function Realizations() {
  const { t, i18n } = useTranslation()
  const [realizations, setRealisations] = useState<Realisation[]>([])
  const [selectedMedia, setSelectedMedia] = useState<Realisation | null>(null)
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setVisibleCount(3)
    } else {
      setVisibleCount(6)
    }
  }, [isMobile])

  useEffect(() => {
    fetchRealisations()
  }, [i18n.language])

  const fetchRealisations = async () => {
    try {
      const response = await fetch(`/api/cms/realisations?lang=${i18n.language}`)
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

  const visibleRealisations = realizations.slice(0, visibleCount)
  
  const getMaxBeforeButton = () => {
    if (isMobile) return 3
    return 6
  }
  
  const hasMore = realizations.length > getMaxBeforeButton() && visibleCount < realizations.length

  const loadMore = () => {
    if (isMobile) {
      setVisibleCount(prev => Math.min(prev + 3, realizations.length))
    } else {
      setVisibleCount(prev => Math.min(prev + 3, realizations.length))
    }
  }

  // Fonction pour obtenir l'ID d'intégration YouTube
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  // Fonction pour obtenir l'ID d'intégration Vimeo
  const getVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  // Rendu du média (image ou vidéo embed)
  const renderMedia = (item: Realisation) => {
    if (item.mediaType === 'video' && item.video) {
      const youtubeId = getYouTubeId(item.video)
      const vimeoId = getVimeoId(item.video)
      
      if (youtubeId) {
        return (
          <div className="relative w-full h-80 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&controls=1&rel=0`}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      }
      
      if (vimeoId) {
        return (
          <div className="relative w-full h-80 bg-black">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=0&controls=1`}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      }
      
      // Vidéo locale
      return (
        <video
          ref={videoRef}
          className="w-full h-80 object-cover"
          poster={item.thumbnail || item.image}
          controls
          preload="metadata"
        >
          <source src={item.video} type="video/mp4" />
          {t('realizations.videoNotSupported')}
        </video>
      )
    }
    
    // Image par défaut
    return (
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
      />
    )
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
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">{t('realizations.title')}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t('realizations.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleRealisations.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: (index % 6) * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer group"
                onClick={() => setSelectedMedia(item)}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  {renderMedia(item)}
                  
                  {/* Badge vidéo */}
                  {item.mediaType === 'video' && (
                    <div className="absolute top-4 right-4 bg-black/70 rounded-full p-2 backdrop-blur-sm">
                      <Play size={20} className="text-white fill-white" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                    <p className="text-white font-semibold text-lg">{item.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <button
                onClick={loadMore}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary/30 text-primary rounded-full hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
              >
                <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
                <span className="font-medium">{t('realizations.viewMore')}</span>
              </button>
            </motion.div>
          )}

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
              {t('gallery.viewAll')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modal amélioré pour afficher images ou vidéos */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={32} />
          </button>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.mediaType === 'video' && selectedMedia.video ? (
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
                {(() => {
                  const youtubeId = getYouTubeId(selectedMedia.video!)
                  const vimeoId = getVimeoId(selectedMedia.video!)
                  
                  if (youtubeId) {
                    return (
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )
                  }
                  
                  if (vimeoId) {
                    return (
                      <iframe
                        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&controls=1`}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    )
                  }
                  
                  return (
                    <video
                      controls
                      autoPlay
                      className="absolute inset-0 w-full h-full"
                      poster={selectedMedia.thumbnail || selectedMedia.image}
                    >
                      <source src={selectedMedia.video} type="video/mp4" />
                      {t('realizations.videoNotSupported')}
                    </video>
                  )
                })()}
              </div>
            ) : (
              <img 
                src={selectedMedia.image} 
                alt={selectedMedia.title}
                className="w-full h-auto rounded-2xl"
              />
            )}
            <p className="text-white text-center mt-4 text-lg">{selectedMedia.title}</p>
            {selectedMedia.category && (
              <p className="text-gray-400 text-center mt-2">{selectedMedia.category}</p>
            )}
          </motion.div>
        </div>
      )}
    </>
  )
}