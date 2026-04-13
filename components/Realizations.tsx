'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Ici ce sont les RÉALISATIONS de LoveExpress (ce que l'entreprise a créé)
const realizations = [
  { url: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg', title: 'Demande en mariage surprise' },
  { url: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg', title: 'Décoration anniversaire 30 ans' },
  { url: 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg', title: 'Ballons personnalisés' },
  { url: 'https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg', title: 'Gift basket anniversaire' },
]

export default function Realizations() {
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
            Nos Réalisations
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Découvrez la magie que nous avons créée pour nos clients
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {realizations.map((item, index) => (
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
                src={item.url} 
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                <span className="text-white font-semibold text-sm">{item.title}</span>
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
            href="/realizations" 
            className="btn-secondary inline-flex items-center gap-2"
          >
            Voir toutes nos réalisations <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
