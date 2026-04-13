'use client'

import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import GiftBaskets from '@/components/GiftBaskets'
import GallerySection from '@/components/GallerySection'
import About from '@/components/About'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <GiftBaskets />
      <GallerySection />
      <About />
      <ContactForm />
      <Footer />
    </main>
  )
}
