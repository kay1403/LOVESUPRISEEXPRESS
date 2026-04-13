'use client'

import { motion } from 'framer-motion'
import { Heart, Sparkles, Calendar, Users, Gift, Star, Clock, Award } from 'lucide-react'

export default function About() {
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
          {/* Photo et badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent z-10" />
              <img 
                src="https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg"
                alt="Fondatrice LoveExpress"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 z-20">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-accent" />
                <span className="font-semibold text-dark">Créations uniques</span>
                <span className="text-gray-400 text-sm">Sur mesure</span>
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
              Je m'appelle <span className="font-semibold text-dark">Grace Uwase</span>, fondatrice de LoveExpress. 
              Depuis 2020, je transforme les moments ordinaires en souvenirs extraordinaires.
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
