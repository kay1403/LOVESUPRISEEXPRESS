'use client'

import Hero from '@/components/Hero'
import Services from '@/components/Services'
import GiftBaskets from '@/components/GiftBaskets'
import Realizations from '@/components/Realizations'
import About from '@/components/About'
import AvisForm from '@/components/AvisForm'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'   // ← ajout

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <GiftBaskets />
      <Realizations />
      <About />
      <AvisForm />
      <ErrorBoundary>          {/* ← ajout */}
        <ContactForm />
      </ErrorBoundary>         {/* ← ajout */}
      <Footer />
    </main>
  )
}