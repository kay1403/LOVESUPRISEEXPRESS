'use client';

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, X, Heart, User, Calendar, Star, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

interface Testimonial {
  id: string
  nom: string
  note: number
  message: string
  photoUrl?: string
  createdAt: string
  status: string
}

const ITEMS_PER_PAGE = 6; // Réduit à 6 pour mobile (3x2 sur desktop)

// ✅ Fonction pour obtenir l'URL absolue des photos
const getImageUrl = (photoUrl: string | undefined): string => {
  if (!photoUrl) return '';
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://lovesupriseexpress.netlify.app';
  const path = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
  return `${baseUrl}${path}`;
};

// ✅ Composant pour tronquer les longs textes sur mobile
const TruncatedText = ({ text, maxLength = 80 }: { text: string; maxLength?: number }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > maxLength;
  
  if (!isLong) return <p className="text-gray-600 text-sm italic">"{text}"</p>;
  
  return (
    <div>
      <p className="text-gray-600 text-sm italic">
        "{expanded ? text : text.substring(0, maxLength)}"
        {!expanded && '...'}
      </p>
      <button 
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        className="text-primary text-xs mt-1 hover:underline"
      >
        {expanded ? 'Voir moins' : 'Voir plus'}
      </button>
    </div>
  );
};

export default function GalleryPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/functions/get-testimonials')
      const data = await response.json()
      if (data.success && data.avis) {
        // ✅ Ne montrer que les avis publiés
        const publishedAvis = data.avis.filter((a: Testimonial) => a.status === 'published');
        setTestimonials(publishedAvis)
      }
    } catch (error) {
      console.error('Erreur chargement témoignages:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTestimonials = testimonials.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // ✅ Fonction pour ouvrir la photo en plein écran
  const openPhotoModal = (photoUrl: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation()
    if (photoUrl) {
      setSelectedPhoto(getImageUrl(photoUrl))
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-primaryLight flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Chargement des témoignages...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-primaryLight">
      {/* Header responsive */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container-custom py-3 md:py-4 px-4 md:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition group">
            <ArrowLeft size={16} className="md:size-18 group-hover:-translate-x-1 transition" />
            <span className="text-sm md:text-base">Retour à l'accueil</span>
          </Link>
        </div>
      </div>

      <section className="py-8 md:py-16">
        <div className="container-custom px-4 md:px-6">
          {/* Titre responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-4 shadow-sm">
              <Heart size={12} className="md:size-14 text-primary" />
              <span className="text-xs md:text-sm font-medium text-primary uppercase tracking-wider">Ils nous ont fait confiance</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-dark mb-3 md:mb-4">
              Avis Clients
            </h1>
            <p className="text-gray-500 text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-4">
              Découvrez les sourires et la joie de nos clients après leurs surprises
            </p>
          </motion.div>

          {testimonials.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl mx-4">
              <Heart size={40} className="md:size-48 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm md:text-base">Aucun témoignage publié pour le moment</p>
              <p className="text-xs md:text-sm text-gray-400 mt-2">Soyez le premier à partager votre expérience !</p>
            </div>
          ) : (
            <>
              {/* Grille responsive - 1 colonne mobile, 2 tablette, 3 desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {paginatedTestimonials.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index % ITEMS_PER_PAGE) * 0.05 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedTestimonial(item)}
                    className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-2xl flex flex-col"
                  >
                    {/* Zone image - hauteur adaptée pour mobile */}
                    {item.photoUrl && (
                      <div className="relative h-48 sm:h-52 md:h-56 flex-shrink-0 overflow-hidden">
                        <>
                          <img 
                            src={getImageUrl(item.photoUrl)} 
                            alt={item.nom} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            onClick={(e) => openPhotoModal(item.photoUrl, e)}
                            className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/80 z-10"
                            title="Agrandir la photo"
                          >
                            <Maximize2 size={14} className="md:size-16 text-white" />
                          </button>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                          <div className="absolute bottom-3 left-3 flex gap-0.5">
                            {[...Array(item.note || 5)].map((_, i) => (
                              <Star key={i} size={10} className="md:size-12 fill-accent text-accent" />
                            ))}
                          </div>
                          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Heart size={32} className="md:size-40 text-white drop-shadow-lg" />
                          </div>
                        </>
                      </div>
                    )}
                    
                    {/* Zone texte - padding adapté */}
                    <div className={`p-4 md:p-5 flex flex-col flex-grow ${!item.photoUrl ? 'pt-6 md:pt-8' : ''}`}>
                      {/* Étoiles si pas de photo */}
                      {!item.photoUrl && (
                        <div className="flex gap-0.5 mb-2 md:mb-3">
                          {[...Array(item.note || 5)].map((_, i) => (
                            <Star key={i} size={14} className="md:size-16 fill-accent text-accent" />
                          ))}
                        </div>
                      )}
                      
                      {/* Nom et avatar */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User size={12} className="md:size-14 text-primary" />
                        </div>
                        <h3 className="font-semibold text-dark text-sm md:text-base truncate">{item.nom}</h3>
                      </div>
                      
                      {/* Date */}
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <Calendar size={10} className="md:size-12 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      {/* Message avec gestion des textes longs */}
                      <TruncatedText text={item.message} maxLength={80} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination responsive */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 md:mt-12">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                  >
                    <ChevronLeft size={16} className="md:size-20" />
                  </button>
                  <div className="flex gap-1 md:gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                      // Afficher seulement les pages proches sur mobile
                      const shouldShow = totalPages <= 5 || 
                                        i + 1 === 1 || 
                                        i + 1 === totalPages || 
                                        Math.abs(i + 1 - currentPage) <= 1;
                      
                      if (!shouldShow && totalPages > 5) {
                        if (i + 1 === 2 || i + 1 === totalPages - 1) {
                          return <span key={i} className="px-2 text-gray-400">...</span>;
                        }
                        return null;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => goToPage(i + 1)}
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-sm md:text-base transition ${
                            currentPage === i + 1 
                              ? 'bg-primary text-white' 
                              : 'border border-gray-300 hover:bg-primary/10'
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                  >
                    <ChevronRight size={16} className="md:size-20" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal avis complet - responsive */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3 md:p-4"
            onClick={() => setSelectedTestimonial(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-2xl w-full bg-white rounded-xl md:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {selectedTestimonial.photoUrl ? (
                  <img 
                    src={getImageUrl(selectedTestimonial.photoUrl)} 
                    alt={selectedTestimonial.nom} 
                    className="w-full h-56 sm:h-64 md:h-80 object-cover cursor-pointer"
                    onClick={() => setSelectedPhoto(getImageUrl(selectedTestimonial.photoUrl))}
                  />
                ) : (
                  <div className="w-full h-56 sm:h-64 md:h-80 bg-gradient-to-br from-primary/20 to-primaryLight flex items-center justify-center">
                    <Heart size={48} className="md:size-64 text-primary/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button 
                  onClick={() => setSelectedTestimonial(null)} 
                  className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/50 backdrop-blur-sm p-1.5 md:p-2 rounded-full hover:bg-black/70 transition"
                >
                  <X size={16} className="md:size-20 text-white" />
                </button>
                {selectedTestimonial.photoUrl && (
                  <button
                    onClick={() => setSelectedPhoto(getImageUrl(selectedTestimonial.photoUrl))}
                    className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-black/50 backdrop-blur-sm p-1.5 md:p-2 rounded-full hover:bg-primary/80 transition"
                    title="Agrandir la photo"
                  >
                    <Maximize2 size={14} className="md:size-18 text-white" />
                  </button>
                )}
                <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 flex gap-0.5">
                  {[...Array(selectedTestimonial.note || 5)].map((_, i) => (
                    <Star key={i} size={14} className="md:size-16 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={14} className="md:size-18 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-dark">{selectedTestimonial.nom}</h3>
                    <div className="flex items-center gap-2">
                      <Calendar size={10} className="md:size-12 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(selectedTestimonial.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic text-base md:text-lg leading-relaxed">"{selectedTestimonial.message}"</p>
                <div className="mt-6 pt-4 border-t flex justify-center">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} size={14} className="md:size-16 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal photo plein écran */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-3 md:p-4 cursor-pointer"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedPhoto} 
                alt="Photo agrandie" 
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/50 backdrop-blur-sm p-1.5 md:p-2 rounded-full hover:bg-black/70 transition"
              >
                <X size={20} className="md:size-24 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}