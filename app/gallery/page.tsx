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

const ITEMS_PER_PAGE = 9;

// Fonction pour obtenir l'URL absolue des photos
const getImageUrl = (photoUrl: string | undefined): string => {
  if (!photoUrl) return '';
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://lovesupriseexpress.netlify.app';
  const path = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
  return `${baseUrl}${path}`;
};

// Composant pour tronquer les longs textes
const TruncatedText = ({ text, maxLength = 100 }: { text: string; maxLength?: number }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > maxLength;
  
  if (!isLong) return <p className="text-gray-600 text-sm italic line-clamp-3">"{text}"</p>;
  
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
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container-custom py-3 md:py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
            <span className="text-sm md:text-base">Retour à l'accueil</span>
          </Link>
        </div>
      </div>

      <section className="py-8 md:py-16">
        <div className="container-custom">
          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-4 shadow-sm">
              <Heart size={14} className="text-primary" />
              <span className="text-xs md:text-sm font-medium text-primary uppercase tracking-wider">Ils nous ont fait confiance</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-dark mb-3 md:mb-4">
              Avis Clients
            </h1>
            <p className="text-gray-500 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
              Découvrez les sourires et la joie de nos clients après leurs surprises
            </p>
          </motion.div>

          {testimonials.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <Heart size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun témoignage publié pour le moment</p>
              <p className="text-sm text-gray-400 mt-2">Soyez le premier à partager votre expérience !</p>
            </div>
          ) : (
            <>
              {/* Grille responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
                {paginatedTestimonials.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index % ITEMS_PER_PAGE) * 0.05 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedTestimonial(item)}
                    className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-2xl flex flex-col h-full"
                  >
                    {/* Zone image - UNIQUEMENT si photo existe */}
                    {item.photoUrl && (
                      <div className="relative h-52 sm:h-56 md:h-60 lg:h-64 flex-shrink-0 overflow-hidden">
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
                          <Maximize2 size={16} className="text-white" />
                        </button>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex gap-0.5">
                          {[...Array(item.note || 5)].map((_, i) => (
                            <Star key={i} size={12} className="fill-accent text-accent" />
                          ))}
                        </div>
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Heart size={40} className="text-white drop-shadow-lg" />
                        </div>
                      </div>
                    )}
                    
                    {/* Zone texte */}
                    <div className={`p-4 md:p-5 flex flex-col flex-grow ${!item.photoUrl ? 'pt-5' : ''}`}>
                      {/* Étoiles */}
                      <div className="flex gap-0.5 mb-2 md:mb-3">
                        {[...Array(item.note || 5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-accent text-accent" />
                        ))}
                      </div>
                      
                      {/* Nom */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User size={14} className="text-primary" />
                        </div>
                        <h3 className="font-semibold text-dark text-sm md:text-base truncate">{item.nom}</h3>
                      </div>
                      
                      {/* Date */}
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      {/* Message */}
                      <div className="flex-grow">
                        <TruncatedText text={item.message} maxLength={100} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center flex-wrap gap-2 mt-8 md:mt-12">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isNear = Math.abs(pageNum - currentPage) <= 1;
                    const isFirst = pageNum === 1;
                    const isLast = pageNum === totalPages;
                    const isFirstGroup = pageNum === 2 && currentPage > 3;
                    const isLastGroup = pageNum === totalPages - 1 && currentPage < totalPages - 2;
                    
                    if (isFirst || isLast || isNear) {
                      return (
                        <button
                          key={i}
                          onClick={() => goToPage(pageNum)}
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-sm md:text-base transition ${
                            currentPage === pageNum 
                              ? 'bg-primary text-white' 
                              : 'border border-gray-300 hover:bg-primary/10'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    
                    if (isFirstGroup || isLastGroup) {
                      return <span key={i} className="px-1 text-gray-400">...</span>;
                    }
                    
                    return null;
                  })}
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ✅ Modal avis complet - CORRIGÉ pour les avis sans photo */}
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
              className="max-w-2xl w-full bg-white rounded-xl md:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ✅ Zone photo - UNIQUEMENT si photo existe */}
              {selectedTestimonial.photoUrl && (
                <div className="relative">
                  <img 
                    src={getImageUrl(selectedTestimonial.photoUrl)} 
                    alt={selectedTestimonial.nom} 
                    className="w-full h-60 md:h-80 object-cover cursor-pointer"
                    onClick={() => setSelectedPhoto(getImageUrl(selectedTestimonial.photoUrl))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button 
                    onClick={() => setSelectedTestimonial(null)} 
                    className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-1.5 md:p-2 rounded-full hover:bg-black/70 transition"
                  >
                    <X size={18} className="text-white" />
                  </button>
                  <button
                    onClick={() => setSelectedPhoto(getImageUrl(selectedTestimonial.photoUrl))}
                    className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm p-1.5 md:p-2 rounded-full hover:bg-primary/80 transition"
                    title="Agrandir la photo"
                  >
                    <Maximize2 size={16} className="text-white" />
                  </button>
                  <div className="absolute bottom-3 left-3 flex gap-0.5">
                    {[...Array(selectedTestimonial.note || 5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-accent text-accent" />
                    ))}
                  </div>
                </div>
              )}
              
              {/* ✅ Contenu - padding différent selon présence de photo */}
              <div className={`p-5 md:p-6 ${!selectedTestimonial.photoUrl ? 'pt-6 md:pt-8' : ''}`}>
                {/* ✅ Étoiles en haut si pas de photo */}
                {!selectedTestimonial.photoUrl && (
                  <div className="flex gap-0.5 mb-4 justify-center">
                    {[...Array(selectedTestimonial.note || 5)].map((_, i) => (
                      <Star key={i} size={20} className="fill-accent text-accent" />
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-dark">{selectedTestimonial.nom}</h3>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-gray-400" />
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
                      <Heart key={i} size={16} className="fill-primary text-primary" />
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
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 cursor-pointer"
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
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition"
              >
                <X size={24} className="text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}