'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FormData {
  clientName: string
  clientPhone: string
  clientEmail: string
  destName: string
  destPhone: string
  destAddress: string
  destAge: string
  eventType: string
  eventDate: string
  eventTime: string
  eventLocation: string
  budget: string
  services: string[]
  message: string
  specialInstructions: string
  isDiscreet: boolean
  needsPersonPresent: boolean
  additionalNotes: string
}

export default function ContactForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    destName: '',
    destPhone: '',
    destAddress: '',
    destAge: '',
    eventType: 'Birthday',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    budget: '',
    services: [],
    message: '',
    specialInstructions: '',
    isDiscreet: false,
    needsPersonPresent: false,
    additionalNotes: ''
  })

  const eventTypes = ['Birthday', 'Proposal', 'Anniversary', 'Baby Shower', 'Bridal Shower', 'Welcome Back Party', 'Other']

  const serviceOptions = ['Balloons & Helium', 'Party Decoration', 'Surprise Planner', 'Teddy Bear', 'Flower Bouquet', 'Gift Basket', 'General Printing']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement
      if (checkbox.checked) {
        setFormData({ ...formData, services: [...formData.services, value] })
      } else {
        setFormData({ ...formData, services: formData.services.filter(s => s !== value) })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          setStep(1)
          setIsSubmitted(false)
          setFormData({
            clientName: '', clientPhone: '', clientEmail: '',
            destName: '', destPhone: '', destAddress: '', destAge: '',
            eventType: 'Birthday', eventDate: '', eventTime: '', eventLocation: '',
            budget: '', services: [], message: '', specialInstructions: '',
            isDiscreet: false, needsPersonPresent: false, additionalNotes: ''
          })
        }, 3000)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  if (isSubmitted) {
    return (
      <section id="contact" className="py-24 bg-white">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto text-center p-12 bg-green-50 rounded-2xl">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-dark mb-2">Demande envoyée !</h3>
            <p className="text-gray-600">Merci pour votre confiance. Nous vous répondrons dans les 30 minutes sur WhatsApp.</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">Plan Your Surprise</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Remplissez ce formulaire et nous nous occupons de tout</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between mb-2 text-sm text-gray-500">
              <span>Etape {step} / 7</span>
              <span>{Math.round((step / 7) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary" initial={{ width: `${((step - 1) / 7) * 100}%` }} animate={{ width: `${((step - 1) / 7) * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Qui êtes-vous ?</h3>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label><input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Téléphone WhatsApp *</label><input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Email (optionnel)</label><input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" /></div>
                  <button type="button" onClick={nextStep} className="btn-primary w-full">Suivant →</button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Qui recevra la surprise ?</h3>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Nom du destinataire *</label><input type="text" name="destName" value={formData.destName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Téléphone du destinataire</label><input type="tel" name="destPhone" value={formData.destPhone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="0788 987 654" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Adresse de livraison *</label><input type="text" name="destAddress" value={formData.destAddress} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Âge (si anniversaire)</label><input type="text" name="destAge" value={formData.destAge} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="30 ans" /></div>
                  <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">← Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Quel événement ?</h3>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Type d'événement *</label><select name="eventType" value={formData.eventType} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">{eventTypes.map(type => <option key={type} value={type}>{type}</option>)}</select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Date de l'événement *</label><input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Heure de livraison souhaitée *</label><input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Lieu exact *</label><input type="text" name="eventLocation" value={formData.eventLocation} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Chez Jean, maison verte" /></div>
                  <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">← Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Budget</h3>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Budget total estimé (RWF) *</label><input type="text" name="budget" value={formData.budget} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="150 000 RWF" /></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600">Nos services commencent à partir de 30 000 RWF. Nous vous ferons un devis personnalisé.</p></div>
                  <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">← Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Services souhaités</h3>
                  <div className="space-y-3">{serviceOptions.map(service => (<label key={service} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer"><input type="checkbox" value={service} checked={formData.services.includes(service)} onChange={handleChange} className="w-5 h-5 text-primary" /><span>{service}</span></label>))}</div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Message à écrire sur la carte</label><textarea name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-lg" placeholder="Joyeux anniversaire mon amour ! Je t'aime" /></div>
                  <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">← Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Instructions spéciales</h3>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Instructions pour l'événement</label><textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} rows={4} className="w-full px-4 py-3 border rounded-lg" placeholder="Theme, couleurs, preferences..." /></div>
                  <div className="bg-primaryLight p-4 rounded-lg"><p className="text-sm text-gray-700">Selon votre type d'événement ({formData.eventType}), nous prendrons en compte tous les détails importants.</p></div>
                  <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">← Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div>
                </motion.div>
              )}

              {step === 7 && (
                <motion.div key="step7" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Confirmation</h3>
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer"><input type="checkbox" checked={formData.isDiscreet} onChange={(e) => setFormData({...formData, isDiscreet: e.target.checked})} className="w-5 h-5" /><span>La surprise doit être discrète (ne pas révéler qui l'envoie)</span></label>
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer"><input type="checkbox" checked={formData.needsPersonPresent} onChange={(e) => setFormData({...formData, needsPersonPresent: e.target.checked})} className="w-5 h-5" /><span>La personne surprise doit être présente lors de la livraison</span></label>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Notes supplémentaires</label><textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-lg" placeholder="Toute information importante..." /></div>
                  <div className="bg-primaryLight p-4 rounded-lg"><p className="font-semibold mb-2">Récapitulatif :</p><ul className="text-sm space-y-1"><li>Client: {formData.clientName || 'Non renseigné'}</li><li>Destinataire: {formData.destName || 'Non renseigné'}</li><li>Événement: {formData.eventType}</li><li>Date: {formData.eventDate || 'Non renseignée'}</li><li>Budget: {formData.budget || 'Non renseigné'} RWF</li></ul></div>
                  <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">← Retour</button><button type="submit" disabled={isSubmitting} className="btn-primary flex-1">{isSubmitting ? 'Envoi...' : 'Envoyer ma demande'}</button></div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  )
}
