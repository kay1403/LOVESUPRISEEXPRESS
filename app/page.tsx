'use client'

import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import GiftBaskets from '@/components/GiftBaskets'
import Realizations from '@/components/Realizations'
import Gallery from '@/components/Gallery'
import About from '@/components/About'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <GiftBaskets />
      <Realizations />
      <Gallery />
      <About />
      <ContactForm />
      <Footer />
    </main>
  )
}
