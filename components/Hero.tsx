'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Heart, ArrowRight, Sparkles, Gift, Calendar, Users } from 'lucide-react'
import LanguageSelector from './LanguageSelector'

// Services data - Adapté à LoveExpress
const services = [
  {
    id: 1,
    title: "Ballons",
    subtitle: "& Hélium",
    badge: "Service Premium",
    description: "Des ballons personnalisés pour tous vos événements. Créez une atmosphère féérique avec nos ballons à l'hélium, disponibles dans toutes les couleurs et formes imaginables.",
    features: ["+50 modèles disponibles", "Livraison sur place", "Installation offerte"],
    image: "https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg",
    cta: "Découvrir",
    bgColor: "#FF4D6D",
    bgLight: "#FFF0F3"
  },
  {
    id: 2,
    title: "Décoration",
    subtitle: "d'Exception",
    badge: "Art & Élégance",
    description: "Transformez n'importe quel espace en un lieu magique. Nos décorations sur mesure créent l'ambiance parfaite pour vos célébrations les plus importantes.",
    features: ["Thèmes personnalisés", "Installation complète", "Démontage inclus"],
    image: "https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg",
    cta: "Explorer",
    bgColor: "#FF4D6D",
    bgLight: "#FFF0F3"
  },
  {
    id: 3,
    title: "Surprise",
    subtitle: "Planner",
    badge: "Expert en émotions",
    description: "Vous avez l'idée, nous l'exécutons. Une organisation sans faille pour des moments de surprise parfaitement orchestrés et totalement inoubliables.",
    features: ["Planification complète", "Discrétion absolue", "Coordination totale"],
    image: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg",
    cta: "Planifier",
    bgColor: "#FF4D6D",
    bgLight: "#FFF0F3"
  },
  {
    id: 4,
    title: "Gift",
    subtitle: "Baskets",
    badge: "Luxe & Douceur",
    description: "Des paniers cadeaux luxueux soigneusement composés selon les goûts et l'occasion. Un cadeau qui marque les esprits et réchauffe les cœurs.",
    features: ["Personnalisation totale", "Produits premium", "Emballage cadeau"],
    image: "https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg",
    cta: "Composer",
    bgColor: "#FF4D6D",
    bgLight: "#FFF0F3"
  }
]

// Composant CTA circulaire
const CircularCTA = ({ label, title, variant, onClick }: { 
  label: string; 
  title: string; 
  variant: 'light' | 'dark';
  onClick: () => void;
}) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="flex flex-col items-center cursor-pointer group"
    onClick={onClick}
  >
    <div className={`
      relative h-28 w-28 md:h-36 md:w-36 rounded-full flex flex-col items-center justify-center p-4 text-center transition-all duration-300 group-hover:shadow-2xl
      ${variant === 'light' ? 'bg-white text-dark shadow-lg' : 'bg-dark/90 text-white backdrop-blur-sm shadow-lg'}
    `}>
      <span className="text-[8px] md:text-[10px] tracking-[0.2em] uppercase mb-1 opacity-60">{label}</span>
      <span className="text-xs md:text-sm font-bold leading-tight">{title}</span>
      
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary h-7 w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        <ArrowRight size={14} className="text-white" />
      </div>
    </div>
  </motion.div>
)

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  
  const currentService = services[currentIndex]

  // Auto-play avec barre de progression
  useEffect(() => {
    if (isHovering) return
    
    const startTime = Date.now()
    let animationFrame: number
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / 6000) * 100, 100)
      setProgress(newProgress)
      
      if (newProgress < 100) {
        animationFrame = requestAnimationFrame(updateProgress)
      }
    }
    
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length)
      setProgress(0)
    }, 6000)
    
    animationFrame = requestAnimationFrame(updateProgress)
    
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animationFrame)
    }
  }, [currentIndex, isHovering])

  const nextSlide = () => {
    setProgress(0)
    setCurrentIndex((prev) => (prev + 1) % services.length)
  }

  const prevSlide = () => {
    setProgress(0)
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length)
  }

  const goToSlide = (index: number) => {
    setProgress(0)
    setCurrentIndex(index)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  }

  const wordVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.2, 1, 0.3, 1] }
    }
  }

  const featureVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  }

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Language selector */}
      <div className="absolute top-6 right-6 z-30">
        <LanguageSelector />
      </div>

      {/* OVERLAY COLORÉ DYNAMIQUE (fond gauche) */}
      <div 
        className="absolute inset-0 z-0 transition-colors duration-700"
        style={{ backgroundColor: currentService.bgLight }}
      />

      {/* L'IMAGE DE FOND (Partie droite) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <img
              src={currentService.image}
              alt={currentService.title}
              className="h-full w-full object-cover object-center"
            />
            <div 
              className="absolute inset-0 mix-blend-multiply opacity-20 transition-colors duration-500"
              style={{ backgroundColor: currentService.bgColor }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* LE MASQUE EN ARC DE CERCLE (Partie gauche) - largeur réduite */}
      <motion.div 
        className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm"
        style={{
          clipPath: 'ellipse(90% 120% at -10% 50%)'
        }}
        initial={{ clipPath: 'ellipse(70% 120% at -15% 50%)' }}
        animate={{ clipPath: 'ellipse(90% 120% at -10% 50%)' }}
        transition={{ duration: 0.8 }}
      />

      {/* Logo en haut à gauche */}
      <div className="absolute top-6 left-6 z-30">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
            <Heart size={18} className="text-white fill-white" />
          </div>
          <span className="font-display text-xl font-bold text-primary">LoveExpress</span>
        </motion.div>
      </div>

      {/* Barre de progression interactive */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
        {services.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className="group relative h-0.5 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: idx === currentIndex ? '60px' : '30px' }}
          >
            <div className={`h-full w-full rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-primary' : 'bg-gray-300 group-hover:bg-gray-400'}`} />
            {idx === currentIndex && (
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary/40 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="relative z-20 flex h-full items-center px-6 lg:px-16">
        <div className="max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full"
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  {currentService.badge}
                </span>
              </motion.div>

              {/* Titre avec effet "reveal" */}
              <div className="space-y-1">
                <div className="overflow-hidden">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key={currentIndex}
                  >
                    <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1]">
                      {currentService.title.split(' ').map((word, i) => (
                        <span key={i} className="block overflow-hidden">
                          <motion.span
                            variants={wordVariants}
                            className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                          >
                            {word}
                          </motion.span>
                        </span>
                      ))}
                      <span className="block overflow-hidden">
                        <motion.span
                          variants={wordVariants}
                          className="block text-dark"
                        >
                          {currentService.subtitle}
                        </motion.span>
                      </span>
                    </h1>
                  </motion.div>
                </div>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-gray-500 text-base leading-relaxed max-w-md"
              >
                {currentService.description}
              </motion.p>

              {/* Points forts */}
              <motion.div 
                className="space-y-2"
                initial="hidden"
                animate="visible"
              >
                {currentService.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    custom={idx}
                    variants={featureVariants}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-px bg-primary" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA PRINCIPAL */}
              <motion.button
                whileHover={{ scale: 1.03, x: 3 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {currentService.cta}
                <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* BOUTONS CIRCULAIRES CTA */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        <CircularCTA 
          label="SURPRENDRE"
          title="Offrir un moment unique"
          variant="light"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <CircularCTA 
          label="ORGANISER"
          title="Créer un événement"
          variant="dark"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        />
      </div>

      {/* Navigation par boutons ronds */}
      <div className="absolute bottom-6 left-6 z-30 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="w-9 h-9 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:shadow-xl transition-all duration-300"
        >
          <ChevronLeft size={16} className="text-primary" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="w-9 h-9 rounded-full bg-primary shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300"
        >
          <ChevronRight size={16} className="text-white" />
        </motion.button>
      </div>

      {/* Compteur de slide */}
      <div className="absolute bottom-6 right-6 z-30">
        <div className="text-right">
          <p className="text-[8px] text-gray-400 uppercase tracking-[0.2em]">Actuel</p>
          <p className="text-xl font-bold text-primary">
            {String(currentIndex + 1).padStart(2, '0')}
            <span className="text-gray-300 text-base">/{String(services.length).padStart(2, '0')}</span>
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 hidden lg:block translate-y-12"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => {
            const servicesSection = document.getElementById('services')
            if (servicesSection) {
              servicesSection.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        >
          <span className="text-[7px] text-gray-400 uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-3.5 h-5 border border-gray-300 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1 bg-primary rounded-full mt-1"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
