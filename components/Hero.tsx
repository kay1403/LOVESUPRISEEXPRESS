'use client'

import { motion } from 'framer-motion'
import LanguageSelector from './LanguageSelector'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primaryLight via-white to-primaryLight">
      {/* Language selector - position absolute */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector />
      </div>

      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg')] bg-cover bg-center opacity-10" />
      
      <div className="container-custom text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-6">
            LoveExpress
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto">
            We create unforgettable surprise moments
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
            Distribution in all kind of party things · Balloon accessories · Helium gas · Surprise planner
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Plan your surprise
          </motion.button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 flex justify-center gap-8 text-sm text-gray-400"
        >
          <span>✓ +250 surprises organisées</span>
          <span>✓ Livraison à Kigali</span>
          <span>✓ Devis gratuit</span>
        </motion.div>
      </div>
    </section>
  )
}
