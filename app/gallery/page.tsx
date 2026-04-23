'use client';

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, X, Heart, User, Calendar, Star, ChevronLeft, ChevronRight } from 'lucide-react'

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

export default function GalleryPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/get-testimonials')
      const data = await response.json()
      if (data.success && data.avis) {
        setTestimonials(data.avis)
      }
    } catch (error) {
      console.error('Erreur chargement témoignages:', error)
    } finally {
      setLoading(false)
    }
  }

  // Pagination
  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTestimonials = testimonials.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
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
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container-custom py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
            Retour à l'accueil
          </Link>
        </div>
      </div>

      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4 shadow-sm">
              <Heart size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Ils nous ont fait confiance</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-dark mb-4">
              Avis Clients
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Découvrez les sourires et la joie de nos clients après leurs surprises
            </p>
          </motion.div>

          {testimonials.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <Heart size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun témoignage pour le moment</p>
              <p className="text-sm text-gray-400 mt-2">Soyez le premier à partager votre expérience !</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTestimonials.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index % ITEMS_PER_PAGE) * 0.05 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedTestimonial(item)}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-2xl"
                  >
                    <div className="relative h-56 overflow-hidden">
                      {item.photoUrl ? (
                        <img src={item.photoUrl} alt={item.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primaryLight flex items-center justify-center">
                          <Heart size={48} className="text-primary/40" />
                        </div>
                      )}
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
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User size={14} className="text-primary" />
                        </div>
                        <h3 className="font-semibold text-dark">{item.nom}</h3>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm italic line-clamp-2">"{item.message}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`w-10 h-10 rounded-lg transition ${currentPage === i + 1 ? 'bg-primary text-white' : 'border border-gray-300 hover:bg-primary/10'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal - inchangé */}
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
              className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {selectedTestimonial.photoUrl ? (
                  <img src={selectedTestimonial.photoUrl} alt={selectedTestimonial.nom} className="w-full h-80 object-cover" />
                ) : (
                  <div className="w-full h-80 bg-gradient-to-br from-primary/20 to-primaryLight flex items-center justify-center">
                    <Heart size={64} className="text-primary/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button onClick={() => setSelectedTestimonial(null)} className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition">
                  <X size={20} className="text-white" />
                </button>
                <div className="absolute bottom-4 left-4 flex gap-0.5">
                  {[...Array(selectedTestimonial.note || 5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark">{selectedTestimonial.nom}</h3>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(selectedTestimonial.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic text-lg leading-relaxed">"{selectedTestimonial.message}"</p>
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
    </main>
  )
}
