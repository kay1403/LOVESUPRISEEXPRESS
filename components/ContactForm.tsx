'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, CheckCircle, Heart, ChevronRight, ChevronLeft, Eye } from 'lucide-react'

interface FormData {
  clientName: string; clientPhone: string; clientEmail: string
  destName: string; destPhone: string; destAddress: string; destAge: string
  eventType: string; eventDate: string; eventTime: string; eventLocation: string
  budget: string; deliveryMethod: string; services: string[]
  message: string; specialInstructions: string
  isDiscreet: boolean; needsPersonPresent: boolean; additionalNotes: string
}

export default function ContactForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [budgetValue, setBudgetValue] = useState(15000)
  const reviewRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])
  
  const [formData, setFormData] = useState<FormData>({
    clientName: '', clientPhone: '', clientEmail: '',
    destName: '', destPhone: '', destAddress: '', destAge: '',
    eventType: 'Birthday', eventDate: '', eventTime: '', eventLocation: '',
    budget: '15000', deliveryMethod: 'delivery', services: [],
    message: '', specialInstructions: '', isDiscreet: false, needsPersonPresent: false, additionalNotes: ''
  })

  const eventTypes = ['Birthday', 'Proposal', 'Anniversary', 'Baby Shower', 'Bridal Shower', 'Welcome Back Party', 'Other']
  const serviceOptions = [
    'Party Decoration - Pack Premier Frisson (60k)',
    'Party Decoration - Pack Love XL (100k)',
    'Party Decoration - Pack ROYAL SURPRISE (200k)',
    'Surprise Planner (200k)',
    'Flower Bouquet (15k)',
    'Custom Website (25k simple / 45k premium)'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement
      if (checkbox.checked) setFormData({ ...formData, services: [...formData.services, value] })
      else setFormData({ ...formData, services: formData.services.filter(s => s !== value) })
    } else setFormData({ ...formData, [name]: value })
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBudgetValue(parseInt(value))
    setFormData({ ...formData, budget: value })
  }

  const downloadPDF = async () => {
    if (!isMounted || !reviewRef.current) return
    // @ts-ignore - no type declarations for html2pdf.js
    const html2pdf = (await import('html2pdf.js')).default as any
    const opt = { margin: [10, 10, 10, 10], filename: `commande_${formData.clientName || 'client'}_${Date.now()}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }
    try { await html2pdf().set(opt).from(reviewRef.current).save() } catch (error) { console.error('Erreur PDF:', error); alert('Erreur lors de la génération du PDF') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true)
    try {
      const response = await fetch('/api/submit-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (response.ok) {
        setTimeout(() => downloadPDF(), 500)
        setIsSubmitted(true)
        setTimeout(() => {
          setStep(1); setIsSubmitted(false)
          setFormData({ clientName: '', clientPhone: '', clientEmail: '', destName: '', destPhone: '', destAddress: '', destAge: '', eventType: 'Birthday', eventDate: '', eventTime: '', eventLocation: '', budget: '15000', deliveryMethod: 'delivery', services: [], message: '', specialInstructions: '', isDiscreet: false, needsPersonPresent: false, additionalNotes: '' })
          setBudgetValue(15000)
        }, 5000)
      } else alert('Erreur lors de l\'envoi. Veuillez réessayer.')
    } catch (error) { console.error('Error:', error); alert('Une erreur est survenue. Veuillez réessayer.') }
    finally { setIsSubmitting(false) }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)
  const goToStep = (targetStep: number) => setStep(targetStep)

  if (isSubmitted) {
    return (
      <section id="contact" className="py-24 bg-white">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto text-center p-12 bg-green-50 rounded-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-green-600" /></div>
            <h3 className="text-2xl font-bold text-dark mb-2">Demande envoyée !</h3>
            <p className="text-gray-600 mb-4">Merci pour votre confiance. Nous vous répondrons dans les 30 minutes sur WhatsApp.</p>
            <p className="text-sm text-gray-500">Votre récapitulatif PDF va être téléchargé automatiquement.</p>
          </motion.div>
        </div>
      </section>
    )
  }

  const getBudgetRange = () => {
    if (budgetValue < 30000) return 'Petit budget : Parfait pour un bouquet'
    if (budgetValue < 60000) return 'Budget doux : Idéal pour un gift basket'
    if (budgetValue < 120000) return 'Budget confortable : Décoration complète'
    if (budgetValue < 250000) return 'Budget généreux : Surprise complète'
    return 'Budget premium : Organisation haut de gamme'
  }

  const minBudget = 15000, maxBudget = 500000, percentage = ((budgetValue - minBudget) / (maxBudget - minBudget)) * 100

  const ReviewContent = () => (
    <div ref={reviewRef} className="bg-white p-6 rounded-xl space-y-4" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="text-center border-b pb-4"><h2 className="text-2xl font-bold text-primary">LoveExpress</h2><p className="text-gray-500 text-sm">Récapitulatif de votre commande</p><p className="text-xs text-gray-400 mt-1">Date: {new Date().toLocaleDateString()}</p></div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">Informations client</h3><div className="grid grid-cols-2 gap-2 text-sm"><p><span className="text-gray-500">Nom:</span> {formData.clientName || 'Non renseigné'}</p><p><span className="text-gray-500">Téléphone:</span> {formData.clientPhone || 'Non renseigné'}</p></div></div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">Informations destinataire</h3><div className="grid grid-cols-2 gap-2 text-sm"><p><span className="text-gray-500">Nom:</span> {formData.destName || 'Non renseigné'}</p><p><span className="text-gray-500">Adresse:</span> {formData.destAddress || 'Non renseignée'}</p></div></div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">Informations événement</h3><div className="grid grid-cols-2 gap-2 text-sm"><p><span className="text-gray-500">Type:</span> {formData.eventType}</p><p><span className="text-gray-500">Date:</span> {formData.eventDate || 'Non renseignée'}</p></div></div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">Budget & Services</h3><p className="text-sm mb-2"><span className="text-gray-500">Budget total:</span> <span className="font-bold text-primary">{parseInt(formData.budget).toLocaleString()} RWF</span></p>{formData.services.length > 0 && (<div><p className="text-gray-500 text-sm mb-1">Services sélectionnés:</p><ul className="list-disc list-inside text-sm">{formData.services.map((s, i) => <li key={i}>{s}</li>)}</ul></div>)}</div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">Livraison</h3><p className="text-sm">{formData.deliveryMethod === 'delivery' ? 'Livraison à domicile (+5 000 RWF)' : 'Retrait au bureau'}</p></div>
      {formData.message && (<div className="bg-primaryLight p-3 rounded-lg"><p className="text-sm italic">"{formData.message}"</p></div>)}
      <div className="text-center text-xs text-gray-400 pt-4 border-t"><p>LoveExpress - Nous livrons l'amour et la gentillesse</p><p>📞 +250 799 366 007</p></div>
    </div>
  )

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4"><Heart size={14} className="text-primary" /><span className="text-xs font-medium text-primary uppercase tracking-wider">Devis gratuit</span></div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">Planifiez Votre Surprise</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Remplissez ce formulaire et nous nous occupons de tout</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8"><div className="flex justify-between mb-2 text-sm text-gray-500"><span>Étape {step} / 7</span><span>{Math.round((step / 7) * 100)}%</span></div><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><motion.div className="h-full bg-primary" initial={{ width: `${((step - 1) / 7) * 100}%` }} animate={{ width: `${((step - 1) / 7) * 100}%` }} transition={{ duration: 0.3 }} /></div></div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (<motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6"><h3 className="text-2xl font-bold text-dark mb-6">Qui êtes-vous ?</h3><div><label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label><input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary" /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Téléphone WhatsApp *</label><input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary" /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Email (optionnel)</label><input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary" /></div><button type="button" onClick={nextStep} className="btn-primary w-full">Suivant →</button></motion.div>)}

              {step === 2 && (<motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6"><h3 className="text-2xl font-bold text-dark mb-6">Qui recevra la surprise ?</h3><div><label className="block text-sm font-medium text-gray-700 mb-2">Nom du destinataire *</label><input type="text" name="destName" value={formData.destName} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label><input type="tel" name="destPhone" value={formData.destPhone} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Adresse de livraison *</label><input type="text" name="destAddress" value={formData.destAddress} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Âge (si anniversaire)</label><input type="text" name="destAge" value={formData.destAge} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" /></div><div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">← Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div></motion.div>)}

              {step === 3 && (<motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6"><h3 className="text-2xl font-bold text-dark mb-6">Quel événement ?</h3><div><label className="block text-sm font-medium text-gray-700 mb-2">Type *</label><select name="eventType" value={formData.eventType} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg">{eventTypes.map(t => <option key={t}>{t}</option>)}</select></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Date *</label><input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Heure *</label><input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Lieu exact *</label><input type="text" name="eventLocation" value={formData.eventLocation} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" /></div><div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">← Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div></motion.div>)}

              {step === 4 && (<motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6"><h3 className="text-2xl font-bold text-dark mb-6">Budget</h3><div><div className="flex justify-between mb-2"><label className="text-sm font-medium text-gray-700">Budget estimé</label><span className="text-primary font-bold">{budgetValue.toLocaleString()} RWF</span></div><input type="range" min="15000" max="500000" step="5000" value={budgetValue} onChange={handleBudgetChange} className="w-full" style={{ background: `linear-gradient(to right, #FF4D6D 0%, #FF4D6D ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)` }} /><div className="flex justify-between text-xs text-gray-500 mt-2"><span>15k</span><span>50k</span><span>100k</span><span>200k</span><span>350k</span><span>500k</span></div></div><div className="bg-primaryLight p-4 rounded-lg"><p className="text-sm text-gray-700">{getBudgetRange()}</p></div><div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">← Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div></motion.div>)}

              {step === 5 && (<motion.div key="step5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6"><h3 className="text-2xl font-bold text-dark mb-6">Services souhaités</h3><div className="space-y-3">{serviceOptions.map(service => (<label key={service} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-primaryLight"><input type="checkbox" value={service} checked={formData.services.includes(service)} onChange={handleChange} className="w-5 h-5 text-primary rounded" /><span>{service}</span></label>))}</div><div><label className="block text-sm font-medium text-gray-700 mb-2">Message sur la carte</label><textarea name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-lg" placeholder="Joyeux anniversaire ! Je t'aime" /></div><div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">← Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div></motion.div>)}

              {step === 6 && (<motion.div key="step6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6"><h3 className="text-2xl font-bold text-dark mb-6">Livraison & Instructions</h3><div><label className="block text-sm font-medium text-gray-700 mb-2">Mode de livraison</label><div className="grid grid-cols-2 gap-4"><label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${formData.deliveryMethod === 'delivery' ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}><input type="radio" name="deliveryMethod" value="delivery" checked={formData.deliveryMethod === 'delivery'} onChange={handleChange} className="w-4 h-4 text-primary" /><div><span className="font-semibold block">Livraison à domicile</span><span className="text-xs text-gray-500">+5 000 RWF</span></div></label><label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${formData.deliveryMethod === 'pickup' ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}><input type="radio" name="deliveryMethod" value="pickup" checked={formData.deliveryMethod === 'pickup'} onChange={handleChange} className="w-4 h-4 text-primary" /><div><span className="font-semibold block">Retrait au bureau</span><span className="text-xs text-gray-500">Gratuit</span></div></label></div></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Instructions spéciales</label><textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-lg" placeholder="Thème, couleurs, préférences..." /></div><div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">← Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div></motion.div>)}

              {step === 7 && (<motion.div key="step7" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6"><h3 className="text-2xl font-bold text-dark mb-6">Vérification</h3><ReviewContent /><label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-primaryLight"><input type="checkbox" checked={formData.isDiscreet} onChange={(e) => setFormData({...formData, isDiscreet: e.target.checked})} className="w-5 h-5 text-primary rounded" /><span>Surprise discrète (ne pas révéler l'expéditeur)</span></label><label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-primaryLight"><input type="checkbox" checked={formData.needsPersonPresent} onChange={(e) => setFormData({...formData, needsPersonPresent: e.target.checked})} className="w-5 h-5 text-primary rounded" /><span>Le destinataire doit être présent lors de la livraison</span></label><div><label className="block text-sm font-medium text-gray-700 mb-2">Notes supplémentaires</label><textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} rows={2} className="w-full px-4 py-3 border rounded-lg" placeholder="Information importante..." /></div><div className="flex flex-col gap-3"><div className="flex gap-4"><button type="button" onClick={() => goToStep(1)} className="btn-secondary flex-1">Modifier</button><button type="button" onClick={downloadPDF} className="bg-gray-100 text-gray-700 px-4 py-3 rounded-full font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2 flex-1"><Download size={18} /> Télécharger PDF</button></div><button type="submit" disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? 'Envoi...' : 'Confirmer et envoyer'}</button></div></motion.div>)}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  )
}
