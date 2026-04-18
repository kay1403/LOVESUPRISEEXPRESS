'use client'

import Hero from '@/components/Hero'
import Services from '@/components/Services'
import GiftBaskets from '@/components/GiftBaskets'
import Realizations from '@/components/Realizations'
import About from '@/components/About'
import TestimonialsSection from '@/components/TestimonialsSection'
import AvisForm from '@/components/AvisForm'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <GiftBaskets />
      <Realizations />
      <About />
      <TestimonialsSection />
      <AvisForm />
      <ContactForm />
      <Footer />
    </main>
  )
}
