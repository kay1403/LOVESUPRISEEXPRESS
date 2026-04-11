'use client'

import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import GiftBaskets from '@/components/GiftBaskets'
import Gallery from '@/components/Gallery'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <GiftBaskets />
      <Gallery />
      <ContactForm />
      <Footer />
    </main>
  )
}
