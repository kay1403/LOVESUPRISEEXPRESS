'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import LanguageSelector from './LanguageSelector'

// Services data
const services = [
  {
    id: 1,
    title: "Bouquet",
    subtitle: "de Fleurs",
    badge: "Frais & Élégant",
    description: "Des bouquets de fleurs fraîches pour toutes les occasions. Roses, lys, tournesols ou compositions sur mesure pour exprimer vos sentiments.",
    features: ["Fleurs fraîches de saison", "Emballage élégant", "Carte personnalisée", "Livraison offerte à Kigali"],
    image: "https://images.pexels.com/photos/35841488/pexels-photo-35841488.jpeg",
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
    image: "https://images.pexels.com/photos/17417854/pexels-photo-17417854.jpeg",
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
    image: "https://images.pexels.com/photos/30319620/pexels-photo-30319620.jpeg",
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
    image: "https://i.pinimg.com/1200x/e6/3e/d3/e63ed35a4e166f7830f1ef5cd2839392.jpg",
    bgColor: "#FF4D6D",
    bgLight: "#FFF0F3"
  }
]

// Cœurs flottants - VISIBLES
const FloatingHearts = () => {
  const hearts = [
    { id: 1, x: "8%", y: "15%", size: 18, duration: 10, delay: 0 },
    { id: 2, x: "15%", y: "45%", size: 24, duration: 12, delay: 2 },
    { id: 3, x: "5%", y: "70%", size: 14, duration: 8, delay: 4 },
    { id: 4, x: "25%", y: "25%", size: 20, duration: 14, delay: 1 },
    { id: 5, x: "12%", y: "85%", size: 16, duration: 11, delay: 3 },
    { id: 6, x: "20%", y: "55%", size: 22, duration: 9, delay: 5 },
    { id: 7, x: "3%", y: "35%", size: 12, duration: 13, delay: 2.5 },
    { id: 8, x: "28%", y: "10%", size: 26, duration: 15, delay: 1.5 },
  ]
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{ left: heart.x, top: heart.y }}
          animate={{
            y: [0, -40, -80, -40, 0],
            x: [0, 15, 0, -15, 0],
            opacity: [0.2, 0.5, 0.3, 0.5, 0.2],
            scale: [1, 1.1, 1, 0.9, 1]
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "easeInOut"
          }}
        >
          <Heart size={heart.size} className="text-primary/40" fill="#FF4D6D" fillOpacity={0.2} />
        </motion.div>
      ))}
    </div>
  )
}

// Étoiles filantes - VISIBLES
const ShootingStars = () => {
  const stars = [
    { id: 1, top: "8%", left: "-5%", duration: 2.5, delay: 0 },
    { id: 2, top: "30%", left: "-10%", duration: 3, delay: 4 },
    { id: 3, top: "55%", left: "-8%", duration: 2.8, delay: 8 },
    { id: 4, top: "75%", left: "-15%", duration: 3.2, delay: 12 },
  ]
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{ top: star.top, left: star.left }}
          animate={{
            x: ["0%", "100%"],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear"
          }}
        >
          <div className="relative">
            <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(255,77,109,0.8)]" />
            <div className="absolute -top-0.5 left-1 w-14 h-px bg-gradient-to-r from-primary to-transparent" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Confettis - VISIBLES
const Confetti = () => {
  const confettis = [
    { id: 1, x: "10%", y: "20%", width: 6, height: 3, color: "#FF4D6D", duration: 6, delay: 0 },
    { id: 2, x: "18%", y: "50%", width: 5, height: 2, color: "#FFD700", duration: 7, delay: 2 },
    { id: 3, x: "7%", y: "75%", width: 4, height: 3, color: "#FF8BA8", duration: 5, delay: 4 },
    { id: 4, x: "22%", y: "35%", width: 7, height: 2, color: "#FF6B8A", duration: 8, delay: 1 },
    { id: 5, x: "14%", y: "65%", width: 5, height: 3, color: "#FF4D6D", duration: 6.5, delay: 3 },
    { id: 6, x: "30%", y: "15%", width: 4, height: 2, color: "#FFD700", duration: 7.5, delay: 5 },
    { id: 7, x: "25%", y: "80%", width: 6, height: 2, color: "#FF8BA8", duration: 5.5, delay: 1.5 },
    { id: 8, x: "3%", y: "40%", width: 5, height: 3, color: "#FF4D6D", duration: 9, delay: 3.5 },
    { id: 9, x: "32%", y: "60%", width: 4, height: 2, color: "#FFD700", duration: 6, delay: 2.5 },
    { id: 10, x: "20%", y: "10%", width: 6, height: 3, color: "#FF6B8A", duration: 8.5, delay: 4.5 },
  ]
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {confettis.map((conf) => (
        <motion.div
          key={conf.id}
          className="absolute"
          style={{
            left: conf.x,
            top: conf.y,
            width: conf.width,
            height: conf.height,
            backgroundColor: conf.color,
          }}
          animate={{
            y: [0, -50, -100, -50, 0],
            x: [0, 20, 0, -20, 0],
            rotate: [0, 180, 360, 180, 0],
            opacity: [0.3, 0.6, 0.3, 0.6, 0.3]
          }}
          transition={{
            duration: conf.duration,
            repeat: Infinity,
            delay: conf.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

// Rubans flottants - VISIBLES
const FloatingRibbons = () => {
  const ribbons = [
    { id: 1, x: "5%", y: "18%", duration: 11, delay: 0 },
    { id: 2, x: "28%", y: "68%", duration: 13, delay: 3 },
    { id: 3, x: "12%", y: "82%", duration: 9, delay: 6 },
    { id: 4, x: "18%", y: "38%", duration: 15, delay: 1.5 },
    { id: 5, x: "32%", y: "52%", duration: 12, delay: 4.5 },
  ]
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {ribbons.map((ribbon) => (
        <motion.div
          key={ribbon.id}
          className="absolute"
          style={{ left: ribbon.x, top: ribbon.y }}
          animate={{
            y: [0, -20, 0, 20, 0],
            x: [0, 15, 0, -15, 0],
            rotate: [0, 15, 0, -15, 0],
            opacity: [0.2, 0.4, 0.2, 0.4, 0.2]
          }}
          transition={{
            duration: ribbon.duration,
            repeat: Infinity,
            delay: ribbon.delay,
            ease: "easeInOut"
          }}
        >
          <svg width="40" height="55" viewBox="0 0 40 55" fill="none">
            <path d="M20 0 L24 14 L38 17 L24 24 L28 38 L20 30 L12 38 L16 24 L2 17 L16 14 Z" fill="#FF4D6D" fillOpacity="0.25" stroke="#FF4D6D" strokeWidth="0.8" strokeOpacity="0.4"/>
            <path d="M20 30 L20 55" stroke="#FF4D6D" strokeWidth="0.8" strokeOpacity="0.3"/>
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

// Ballons flottants - VISIBLES
const FloatingBalloons = () => {
  const balloons = [
    { id: 1, x: "45%", y: "5%", size: 38, color: "#FF4D6D", duration: 16, delay: 0 },
    { id: 2, x: "52%", y: "48%", size: 32, color: "#FFD700", duration: 20, delay: 5 },
    { id: 3, x: "38%", y: "30%", size: 35, color: "#FF8BA8", duration: 14, delay: 2 },
    { id: 4, x: "55%", y: "70%", size: 28, color: "#FF6B8A", duration: 18, delay: 8 },
    { id: 5, x: "42%", y: "85%", size: 42, color: "#FF4D6D", duration: 22, delay: 3 },
    { id: 6, x: "60%", y: "20%", size: 30, color: "#FFD700", duration: 15, delay: 6 },
  ]
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {balloons.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute"
          style={{ left: balloon.x, top: balloon.y }}
          animate={{
            y: [0, -25, -50, -25, 0],
            x: [0, 12, 0, -12, 0],
            rotate: [0, 5, -5, 5, 0],
            opacity: [0.2, 0.4, 0.2, 0.4, 0.2]
          }}
          transition={{
            duration: balloon.duration,
            repeat: Infinity,
            delay: balloon.delay,
            ease: "easeInOut"
          }}
        >
          <svg width={balloon.size} height={balloon.size * 1.2} viewBox="0 0 40 50" fill="none">
            <ellipse cx="20" cy="20" rx="14" ry="18" fill={balloon.color} fillOpacity="0.15" stroke={balloon.color} strokeWidth="1" strokeOpacity="0.4"/>
            <line x1="20" y1="38" x2="20" y2="48" stroke={balloon.color} strokeWidth="1" strokeOpacity="0.3"/>
            <polygon points="16,48 24,48 20,44" fill={balloon.color} fillOpacity="0.2"/>
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  
  const currentService = services[currentIndex]

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
    hidden: (i: number) => ({
      x: -20,
      opacity: 0,
      filter: "blur(4px)"
    }),
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.2, 0.9, 0.3, 1] }
    })
  }

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Language selector */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      {/* OVERLAY COLORÉ DYNAMIQUE */}
      <div 
        className="absolute inset-0 z-0 transition-colors duration-700"
        style={{ backgroundColor: currentService.bgLight }}
      />

      {/* IMAGE DE FOND */}
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

      {/* MASQUE EN ARC DE CERCLE - plus transparent */}
      <motion.div 
        className="absolute inset-0 z-10 bg-white/85 backdrop-blur-sm"
        style={{ clipPath: 'ellipse(80% 120% at -15% 50%)' }}
        initial={{ clipPath: 'ellipse(60% 120% at -20% 50%)' }}
        animate={{ clipPath: 'ellipse(80% 120% at -15% 50%)' }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* ÉLÉMENTS DÉCORATIFS - z-index 25 (PAR-DESSUS le masque) */}
      <FloatingHearts />
      <ShootingStars />
      <Confetti />
      <FloatingRibbons />
      <FloatingBalloons />

      {/* LOGO */}
      <div className="absolute top-6 left-6 z-30">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-10 h-10"
        >
          <Image
            src="/images/logoCreator_imagetologo-3.jpg"
            alt="Love Surprise Express Logo"
            width={40}
            height={40}
            className="rounded-xl shadow-lg object-cover"
          />
        </motion.div>
      </div>

      {/* LOVE SURPRISE EXPRESS - TRÈS GRAND */}
      <div className="absolute top-20 left-6 z-30">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col"
        >
          <span className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary tracking-tight leading-[1.1]">
            Love Surprise
          </span>
          <span className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-gray-700 tracking-tight leading-[1.1]">
            Express
          </span>
        </motion.div>
      </div>

      {/* BARRE DE PROGRESSION */}
      <div className="absolute top-48 left-6 z-30 flex gap-1.5">
        {services.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className="group relative h-0.5 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: idx === currentIndex ? '50px' : '25px' }}
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
      <div className="relative z-30 flex h-full items-center px-6 lg:px-16 pt-64">
        <div className="max-w-xl text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full"
              >
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  {currentService.badge}
                </span>
              </motion.div>

              <div className="space-y-1">
                <div className="overflow-hidden">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key={currentIndex}
                  >
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.2]">
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
                    </h2>
                  </motion.div>
                </div>
              </div>

              {/* Description - RESPONSIVE CORRIGÉE */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md w-full break-words"
              >
                {currentService.description}
              </motion.p>

              <motion.div 
                className="space-y-1.5"
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
                    <div className="w-3 h-px bg-primary" />
                    <span className="text-gray-600 text-xs">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* FLÈCHE CLIGNOTANTE SEULE */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 cursor-pointer">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => {
            const servicesSection = document.getElementById('services')
            if (servicesSection) {
              servicesSection.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        >
          <ChevronDown size={28} className="text-primary/60 animate-pulse" strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* NAVIGATION */}
      <div className="absolute bottom-6 left-6 z-30 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-gray-100 flex items-center justify-center hover:bg-white transition-all duration-300"
        >
          <ChevronLeft size={12} className="text-primary" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="w-7 h-7 rounded-full bg-primary/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-primary transition-all duration-300"
        >
          <ChevronRight size={12} className="text-white" />
        </motion.button>
      </div>

      {/* COMPTEUR */}
      <div className="absolute bottom-6 right-6 z-30">
        <div className="text-right">
          <p className="text-[8px] text-gray-400 uppercase tracking-[0.2em]">Actuel</p>
          <p className="text-base font-bold text-primary">
            {String(currentIndex + 1).padStart(2, '0')}
            <span className="text-gray-300 text-xs">/{String(services.length).padStart(2, '0')}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
