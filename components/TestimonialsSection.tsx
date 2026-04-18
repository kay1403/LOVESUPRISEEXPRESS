'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Star, Heart, User, Quote } from 'lucide-react'

interface Testimonial {
  id: string
  nom: string
  note: number
  message: string
  photoUrl?: string
  createdAt: string
  status: string
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/get-testimonials')
      const data = await response.json()
      if (data.success && data.avis) {
        setTestimonials(data.avis)
      } else {
        // Données de démonstration si pas d'API
        setTestimonials([
          {
            id: '1',
            nom: 'Marie & Jean',
            note: 5,
            message: 'Merci LoveExpress pour ce moment magique ! La demande en mariage était parfaite.',
            createdAt: '2026-03-15',
            status: 'published'
          },
          {
            id: '2',
            nom: 'Sarah',
            note: 5,
            message: 'Une décoration magnifique pour mes 30 ans, tout le monde a adoré !',
            createdAt: '2026-04-02',
            status: 'published'
          },
          {
            id: '3',
            nom: 'David',
            note: 5,
            message: 'Les ballons étaient parfaits pour la baby shower, merci !',
            createdAt: '2026-03-20',
            status: 'published'
          },
          {
            id: '4',
            nom: 'Clarisse',
            note: 5,
            message: 'Mon mari a été tellement surpris pour son anniversaire !',
            createdAt: '2026-04-10',
            status: 'published'
          }
        ])
      }
    } catch (err) {
      console.error('Erreur chargement témoignages:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-24 bg-primaryLight">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Chargement des témoignages...</p>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0 && !error) {
    return null
  }

  return (
    <section className="py-24 bg-primaryLight">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Heart size={14} className="text-primary fill-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Ils nous ont fait confiance</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
            Ce que nos clients disent
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Des centaines de clients satisfaits à Kigali et dans tout le Rwanda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote size={32} className="text-primary/20" />
              </div>
              
              {/* Message */}
              <p className="text-gray-700 italic leading-relaxed mb-4">
                "{testimonial.message}"
              </p>
              
              {/* Étoiles */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${i < testimonial.note ? 'fill-accent text-accent' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              
              {/* Nom et date */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-dark">{testimonial.nom}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(testimonial.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {testimonials.length > 6 && (
          <div className="text-center mt-10">
            <button className="text-primary font-semibold hover:text-accent transition">
              Voir plus de témoignages →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
