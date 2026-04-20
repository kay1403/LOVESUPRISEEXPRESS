'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, CheckCircle, Heart, ChevronRight, ChevronLeft, Eye, AlertCircle, Package, Sparkles, Globe, Flower2, Gift, PartyPopper, Baby, Coffee } from 'lucide-react'

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
  selectedServices: number[]
  selectedPacks: number[]
  selectedBaskets: { id: number; version: 'standard' | 'premium' }[]
  budget: number
  deliveryMethod: 'delivery' | 'pickup'
  message: string
  specialInstructions: string
  isDiscreet: boolean
  needsPersonPresent: boolean
  additionalNotes: string
}

const servicesData = [
  { id: 1, name: 'Party Decoration', icon: PartyPopper, packs: [
    { id: 1, name: 'Pack Premier Frisson', price: 60000, desc: '15 ballons, message au sol en pétale, 5 photos suspendues, LED ou bougie' },
    { id: 2, name: 'Pack Love XL', price: 100000, desc: '25 ballons, lettre/chiffre lumineux, table dressée pour deux, bougie parfumée, playlist personnalisée' },
    { id: 3, name: 'Pack ROYAL SURPRISE', price: 200000, desc: 'Rideau de ballons + néon personnalisé, plateau de fruits + vin, photographe 20 min, bouquet de fleurs' }
  ] },
  { id: 2, name: 'Surprise Planner', icon: Sparkles, price: 200000, desc: 'Dites nous l\'occasion et on planifie toute la surprise' },
  { id: 3, name: 'Custom Website', icon: Globe, priceMin: 25000, priceMax: 45000, desc: 'Site web personnalisé pour votre événement' },
  { id: 4, name: 'Flower Bouquet', icon: Flower2, price: 15000, desc: 'Bouquet de fleurs fraîches pour toute occasion' }
]

const basketsData = [
  { id: 1, name: 'Birthday', icon: Gift, standard: 15000, premium: 80000, desc: 'Mini gâteau, bougie, carte, jus de fruit' },
  { id: 2, name: 'Romantic', icon: Heart, standard: 40000, premium: 50000, desc: 'Chocolat, bougies, lettre, fleurs' },
  { id: 3, name: 'New Baby', icon: Baby, standard: 40000, premium: 80000, desc: 'Vêtements, couches, soin, doudou' },
  { id: 4, name: 'Gourmet', icon: Coffee, standard: 20000, premium: 70000, desc: 'Biscuits, fruits, chocolat, jus, bonbons' },
  { id: 5, name: 'Wellness', icon: Flower2, standard: 50000, premium: 100000, desc: 'Thé, huiles, savon, masques, parfum, crème' }
]

const eventTypes = ['Birthday', 'Proposal', 'Anniversary', 'Baby Shower', 'Bridal Shower', 'Welcome Back Party', 'Other']

export default function ContactForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [budgetError, setBudgetError] = useState('')
  const reviewRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<FormData>({
    clientName: '', clientPhone: '', clientEmail: '',
    destName: '', destPhone: '', destAddress: '', destAge: '',
    eventType: 'Birthday', eventDate: '', eventTime: '', eventLocation: '',
    selectedServices: [], selectedPacks: [], selectedBaskets: [],
    budget: 0, deliveryMethod: 'delivery',
    message: '', specialInstructions: '', isDiscreet: false, needsPersonPresent: false, additionalNotes: ''
  })

  useEffect(() => { setIsMounted(true) }, [])

  const calculateTotalPrice = (): number => {
    let total = 0

    // Party Decoration packs
    formData.selectedPacks.forEach(packId => {
      const pack = servicesData[0].packs.find(p => p.id === packId)
      if (pack) total += pack.price
    })

    // Surprise Planner
    if (formData.selectedServices.includes(2)) total += 200000

    // Custom Website
    if (formData.selectedServices.includes(3)) total += 35000

    // Flower Bouquet
    if (formData.selectedServices.includes(4)) total += 15000

    // Gift Baskets
    formData.selectedBaskets.forEach(basket => {
      const b = basketsData.find(bk => bk.id === basket.id)
      if (b) total += basket.version === 'standard' ? b.standard : b.premium
    })

    // Livraison
    if (formData.deliveryMethod === 'delivery') total += 5000

    return total
  }

  const totalPrice = calculateTotalPrice()
  const hasValidSelection = totalPrice > 0

  const handlePackToggle = (packId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedPacks: prev.selectedPacks.includes(packId)
        ? prev.selectedPacks.filter(id => id !== packId)
        : [...prev.selectedPacks, packId]
    }))
  }

  const handleServiceToggle = (serviceId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }))
  }

  const handleBasketToggle = (basketId: number, version: 'standard' | 'premium') => {
    setFormData(prev => {
      const exists = prev.selectedBaskets.find(b => b.id === basketId)
      if (exists) {
        return { ...prev, selectedBaskets: prev.selectedBaskets.filter(b => b.id !== basketId) }
      } else {
        return { ...prev, selectedBaskets: [...prev.selectedBaskets, { id: basketId, version }] }
      }
    })
  }

  const updateBasketVersion = (basketId: number, version: 'standard' | 'premium') => {
    setFormData(prev => ({
      ...prev,
      selectedBaskets: prev.selectedBaskets.map(b => b.id === basketId ? { ...b, version } : b)
    }))
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    setFormData(prev => ({ ...prev, budget: value }))
    if (value < totalPrice) {
      setBudgetError(`Budget minimum requis : ${totalPrice.toLocaleString()} RWF`)
    } else {
      setBudgetError('')
    }
  }

  const downloadPDF = async () => {
    if (!isMounted || !reviewRef.current) return
    const html2pdf = (await import('html2pdf.js')).default
    const opt = { margin: [10, 10, 10, 10], filename: `commande_${formData.clientName || 'client'}_${Date.now()}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }
    try { await html2pdf().set(opt).from(reviewRef.current).save() } catch (error) { console.error('Erreur PDF:', error) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasValidSelection) { alert('Veuillez sélectionner au moins un service ou un panier cadeau'); return }
    if (formData.budget > 0 && formData.budget < totalPrice) { alert(`Le budget minimum est de ${totalPrice.toLocaleString()} RWF`); return }
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/submit-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, totalPrice, budget: formData.budget || totalPrice }) })
      if (response.ok) {
        setTimeout(() => downloadPDF(), 500)
        setIsSubmitted(true)
        setTimeout(() => {
          setStep(1)
          setIsSubmitted(false)
          setFormData({
            clientName: '', clientPhone: '', clientEmail: '', destName: '', destPhone: '', destAddress: '', destAge: '',
            eventType: 'Birthday', eventDate: '', eventTime: '', eventLocation: '',
            selectedServices: [], selectedPacks: [], selectedBaskets: [],
            budget: 0, deliveryMethod: 'delivery', message: '', specialInstructions: '',
            isDiscreet: false, needsPersonPresent: false, additionalNotes: ''
          })
        }, 5000)
      } else alert('Erreur lors de l\'envoi')
    } catch (error) { console.error(error); alert('Erreur') }
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

  const ReviewContent = () => (
    <div ref={reviewRef} className="bg-white p-6 rounded-xl space-y-4" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="text-center border-b pb-4"><h2 className="text-2xl font-bold text-primary">LoveExpress</h2><p className="text-gray-500 text-sm">Récapitulatif de votre commande</p><p className="text-xs text-gray-400 mt-1">Date: {new Date().toLocaleDateString()}</p></div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">Informations client</h3><div className="grid grid-cols-2 gap-2 text-sm"><p><span className="text-gray-500">Nom:</span> {formData.clientName || 'Non renseigné'}</p><p><span className="text-gray-500">Téléphone:</span> {formData.clientPhone || 'Non renseigné'}</p></div></div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">Informations destinataire</h3><div className="grid grid-cols-2 gap-2 text-sm"><p><span className="text-gray-500">Nom:</span> {formData.destName || 'Non renseigné'}</p><p><span className="text-gray-500">Adresse:</span> {formData.destAddress || 'Non renseignée'}</p></div></div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">Informations événement</h3><div className="grid grid-cols-2 gap-2 text-sm"><p><span className="text-gray-500">Type:</span> {formData.eventType}</p><p><span className="text-gray-500">Date:</span> {formData.eventDate || 'Non renseignée'}</p></div></div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">Services & Packs</h3>
        <ul className="text-sm space-y-1">
          {formData.selectedPacks.map(packId => {
            const pack = servicesData[0].packs.find(p => p.id === packId)
            return <li key={packId}>• {pack?.name} : {pack?.price.toLocaleString()} RWF</li>
          })}
          {formData.selectedServices.includes(2) && <li>• Surprise Planner : 200 000 RWF</li>}
          {formData.selectedServices.includes(3) && <li>• Custom Website : 35 000 RWF (estimation)</li>}
          {formData.selectedServices.includes(4) && <li>• Flower Bouquet : 15 000 RWF</li>}
          {formData.selectedBaskets.map(b => {
            const basket = basketsData.find(bk => bk.id === b.id)
            return <li key={b.id}>• {basket?.name} ({b.version}) : {b.version === 'standard' ? basket?.standard.toLocaleString() : basket?.premium.toLocaleString()} RWF</li>
          })}
        </ul>
      </div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">Livraison</h3><p className="text-sm">{formData.deliveryMethod === 'delivery' ? 'Livraison à domicile (+5 000 RWF)' : 'Retrait au bureau'}</p></div>
      <div className="border-t pt-3"><div className="flex justify-between"><span className="font-semibold">Total :</span><span className="font-bold text-primary text-lg">{totalPrice.toLocaleString()} RWF</span></div></div>
      {formData.message && (<div className="bg-primaryLight p-3 rounded-lg"><p className="text-sm italic">"{formData.message}"</p></div>)}
      <div className="text-center text-xs text-gray-400 pt-4 border-t"><p>LoveExpress - Nous livrons l'amour et la gentillesse</p><p>Tel: +250 799 366 007</p></div>
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
          <div className="mb-8"><div className="flex justify-between mb-2 text-sm text-gray-500"><span>Étape {step} / 6</span><span>{Math.round((step / 6) * 100)}%</span></div><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><motion.div className="h-full bg-primary" initial={{ width: `${((step - 1) / 6) * 100}%` }} animate={{ width: `${((step - 1) / 6) * 100}%` }} transition={{ duration: 0.3 }} /></div></div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Qui êtes-vous ?</h3>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label><input type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Téléphone WhatsApp *</label><input type="tel" value={formData.clientPhone} onChange={(e) => setFormData({...formData, clientPhone: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Email (optionnel)</label><input type="email" value={formData.clientEmail} onChange={(e) => setFormData({...formData, clientEmail: e.target.value})} className="w-full px-4 py-3 border rounded-lg" /></div>
                  <button type="button" onClick={nextStep} className="btn-primary w-full">Suivant →</button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Qui recevra la surprise ?</h3>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Nom du destinataire *</label><input type="text" value={formData.destName} onChange={(e) => setFormData({...formData, destName: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label><input type="tel" value={formData.destPhone} onChange={(e) => setFormData({...formData, destPhone: e.target.value})} className="w-full px-4 py-3 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Adresse de livraison *</label><input type="text" value={formData.destAddress} onChange={(e) => setFormData({...formData, destAddress: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Âge (si anniversaire)</label><input type="text" value={formData.destAge} onChange={(e) => setFormData({...formData, destAge: e.target.value})} className="w-full px-4 py-3 border rounded-lg" /></div>
                  <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Quel événement ?</h3>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Type *</label><select value={formData.eventType} onChange={(e) => setFormData({...formData, eventType: e.target.value})} className="w-full px-4 py-3 border rounded-lg">{eventTypes.map(t => <option key={t}>{t}</option>)}</select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Date *</label><input type="date" value={formData.eventDate} onChange={(e) => setFormData({...formData, eventDate: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Heure *</label><input type="time" value={formData.eventTime} onChange={(e) => setFormData({...formData, eventTime: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Lieu exact *</label><input type="text" value={formData.eventLocation} onChange={(e) => setFormData({...formData, eventLocation: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" /></div>
                  <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Que souhaitez-vous commander ?</h3>
                  
                  {/* Party Decoration */}
                  <div className="border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3"><PartyPopper size={18} className="text-primary" /><h4 className="font-semibold text-dark">Party Decoration</h4></div>
                    <div className="space-y-2">
                      {servicesData[0].packs.map(pack => (
                        <label key={pack.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition ${formData.selectedPacks.includes(pack.id) ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}>
                          <input type="checkbox" checked={formData.selectedPacks.includes(pack.id)} onChange={() => handlePackToggle(pack.id)} className="w-4 h-4 text-primary rounded" />
                          <div className="flex-1"><span className="font-medium">{pack.name}</span><p className="text-xs text-gray-500">{pack.desc}</p></div>
                          <span className="text-primary font-bold">{pack.price.toLocaleString()} RWF</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Surprise Planner */}
                  <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${formData.selectedServices.includes(2) ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3"><Sparkles size={18} className="text-primary" /><div><span className="font-medium">Surprise Planner</span><p className="text-xs text-gray-500">Planification complète + coordination sur place</p></div></div>
                    <div className="flex items-center gap-4"><span className="text-primary font-bold">200 000 RWF</span><input type="checkbox" checked={formData.selectedServices.includes(2)} onChange={() => handleServiceToggle(2)} className="w-4 h-4 text-primary rounded" /></div>
                  </label>

                  {/* Custom Website */}
                  <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${formData.selectedServices.includes(3) ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3"><Globe size={18} className="text-primary" /><div><span className="font-medium">Custom Website</span><p className="text-xs text-gray-500">Site personnalisé pour votre événement</p></div></div>
                    <div className="flex items-center gap-4"><span className="text-primary font-bold">25 000 - 45 000 RWF</span><input type="checkbox" checked={formData.selectedServices.includes(3)} onChange={() => handleServiceToggle(3)} className="w-4 h-4 text-primary rounded" /></div>
                  </label>

                  {/* Flower Bouquet */}
                  <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${formData.selectedServices.includes(4) ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3"><Flower2 size={18} className="text-primary" /><div><span className="font-medium">Flower Bouquet</span><p className="text-xs text-gray-500">Bouquet de fleurs fraîches</p></div></div>
                    <div className="flex items-center gap-4"><span className="text-primary font-bold">15 000 RWF</span><input type="checkbox" checked={formData.selectedServices.includes(4)} onChange={() => handleServiceToggle(4)} className="w-4 h-4 text-primary rounded" /></div>
                  </label>

                  {/* Gift Baskets */}
                  <div className="border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3"><Gift size={18} className="text-primary" /><h4 className="font-semibold text-dark">Gift Baskets</h4></div>
                    <div className="space-y-3">
                      {basketsData.map(basket => (
                        <div key={basket.id} className={`p-3 rounded-lg border transition ${formData.selectedBaskets.some(b => b.id === basket.id) ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3"><basket.icon size={16} className="text-primary" /><span className="font-medium">{basket.name}</span></div>
                            <input type="checkbox" checked={formData.selectedBaskets.some(b => b.id === basket.id)} onChange={() => handleBasketToggle(basket.id, 'standard')} className="w-4 h-4 text-primary rounded" />
                          </div>
                          {formData.selectedBaskets.some(b => b.id === basket.id) && (
                            <div className="flex gap-3 ml-6 mt-2">
                              <label className="flex items-center gap-2"><input type="radio" name={`version-${basket.id}`} checked={formData.selectedBaskets.find(b => b.id === basket.id)?.version === 'standard'} onChange={() => updateBasketVersion(basket.id, 'standard')} className="w-4 h-4 text-primary" /><span className="text-sm">Standard: {basket.standard.toLocaleString()} RWF</span></label>
                              <label className="flex items-center gap-2"><input type="radio" name={`version-${basket.id}`} checked={formData.selectedBaskets.find(b => b.id === basket.id)?.version === 'premium'} onChange={() => updateBasketVersion(basket.id, 'premium')} className="w-4 h-4 text-primary" /><span className="text-sm">Premium: {basket.premium.toLocaleString()} RWF</span></label>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 ml-6 mt-1">{basket.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message sur carte */}
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Message sur la carte</label><textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={3} className="w-full px-4 py-3 border rounded-lg" placeholder="Joyeux anniversaire ! Je t'aime" /></div>

                  {/* Instructions spéciales */}
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Instructions spéciales</label><textarea value={formData.specialInstructions} onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})} rows={2} className="w-full px-4 py-3 border rounded-lg" placeholder="Thème, couleurs, préférences..." /></div>

                  <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Livraison & Budget</h3>
                  
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Mode de livraison</label><div className="grid grid-cols-2 gap-4"><label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${formData.deliveryMethod === 'delivery' ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}><input type="radio" name="deliveryMethod" value="delivery" checked={formData.deliveryMethod === 'delivery'} onChange={() => setFormData({...formData, deliveryMethod: 'delivery'})} className="w-4 h-4 text-primary" /><div><span className="font-semibold block">Livraison à domicile</span><span className="text-xs text-gray-500">+5 000 RWF</span></div></label><label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${formData.deliveryMethod === 'pickup' ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}><input type="radio" name="deliveryMethod" value="pickup" checked={formData.deliveryMethod === 'pickup'} onChange={() => setFormData({...formData, deliveryMethod: 'pickup'})} className="w-4 h-4 text-primary" /><div><span className="font-semibold block">Retrait au bureau</span><span className="text-xs text-gray-500">Gratuit</span></div></label></div></div>

                  <div className="bg-primaryLight rounded-xl p-5">
                    <h4 className="font-semibold text-dark mb-3">Récapitulatif des services</h4>
                    <div className="space-y-2 text-sm">
                      {formData.selectedPacks.map(packId => {
                        const pack = servicesData[0].packs.find(p => p.id === packId)
                        return <div key={packId} className="flex justify-between"><span>{pack?.name}</span><span className="font-bold">{pack?.price.toLocaleString()} RWF</span></div>
                      })}
                      {formData.selectedServices.includes(2) && <div className="flex justify-between"><span>Surprise Planner</span><span className="font-bold">200 000 RWF</span></div>}
                      {formData.selectedServices.includes(3) && <div className="flex justify-between"><span>Custom Website</span><span className="font-bold">~35 000 RWF</span></div>}
                      {formData.selectedServices.includes(4) && <div className="flex justify-between"><span>Flower Bouquet</span><span className="font-bold">15 000 RWF</span></div>}
                      {formData.selectedBaskets.map(b => {
                        const basket = basketsData.find(bk => bk.id === b.id)
                        return <div key={b.id} className="flex justify-between"><span>{basket?.name} ({b.version})</span><span className="font-bold">{b.version === 'standard' ? basket?.standard.toLocaleString() : basket?.premium.toLocaleString()} RWF</span></div>
                      })}
                      {formData.deliveryMethod === 'delivery' && <div className="flex justify-between"><span>Livraison</span><span className="font-bold">+5 000 RWF</span></div>}
                      <div className="border-t pt-2 mt-2 flex justify-between"><span className="font-bold">Total :</span><span className="font-bold text-primary text-lg">{totalPrice.toLocaleString()} RWF</span></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Votre budget (RWF)</label>
                    <input type="number" value={formData.budget || totalPrice} onChange={handleBudgetChange} className="w-full px-4 py-3 border rounded-lg" placeholder={totalPrice.toString()} />
                    {budgetError && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{budgetError}</p>}
                    <p className="text-xs text-gray-400 mt-1">Budget minimum requis : {totalPrice.toLocaleString()} RWF</p>
                  </div>

                  <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">Retour</button><button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button></div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Vérification</h3>
                  
                  <ReviewContent />
                  
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-primaryLight"><input type="checkbox" checked={formData.isDiscreet} onChange={(e) => setFormData({...formData, isDiscreet: e.target.checked})} className="w-5 h-5 text-primary rounded" /><span>Surprise discrète (ne pas révéler l'expéditeur)</span></label>
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-primaryLight"><input type="checkbox" checked={formData.needsPersonPresent} onChange={(e) => setFormData({...formData, needsPersonPresent: e.target.checked})} className="w-5 h-5 text-primary rounded" /><span>Le destinataire doit être présent lors de la livraison</span></label>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Notes supplémentaires</label><textarea value={formData.additionalNotes} onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})} rows={2} className="w-full px-4 py-3 border rounded-lg" placeholder="Information importante..." /></div>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4">
                      <button type="button" onClick={() => goToStep(4)} className="btn-secondary flex-1">Modifier la commande</button>
                      <button type="button" onClick={downloadPDF} className="bg-gray-100 text-gray-700 px-4 py-3 rounded-full font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2 flex-1"><Download size={18} /> Télécharger PDF</button>
                    </div>
                    <button type="submit" disabled={isSubmitting || (!hasValidSelection) || (formData.budget > 0 && formData.budget < totalPrice)} className="btn-primary w-full">{isSubmitting ? 'Envoi...' : 'Confirmer et envoyer'}</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  )
}
