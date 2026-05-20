// components/ContactForm.tsx (VERSION FINALE - INTERFACE STATICBASKET CORRIGÉE)
'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, CheckCircle, Heart, AlertCircle, Package, Sparkles, Globe, Flower2, Gift, PartyPopper, Baby, Coffee, LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useServicesSafe, useGiftBasketsSafe, useMaintenanceSafe } from '@/lib/api-wrapper'
import MaintenanceBanner from './MaintenanceBanner'

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

interface StaticService {
  id: number
  nameKey: string
  icon: LucideIcon
  hasPacks?: boolean
  price?: number
  priceMin?: number
  priceMax?: number
  descKey?: string
}

interface StaticBasket {
  id: number
  nameKey: string
  icon: LucideIcon
  standard: number
  premium: number
  descKey: string
  // ✅ Ajout des propriétés utilisées dans le code
  name?: string      // Nom traduit (fusionné avec CMS)
  desc?: string      // Description traduite (fusionnée avec CMS)
}

interface Pack {
  id: number
  name: string
  price: number
  desc: string
}

interface Service {
  id: number
  name?: string
  packs?: Pack[]
  price?: number
  description?: string
}

// Données statiques pour le formulaire (les noms des services sont des clés, pas les valeurs)
const STATIC_SERVICES: StaticService[] = [
  { id: 1, nameKey: 'party', icon: PartyPopper, hasPacks: true },
  { id: 2, nameKey: 'surprise', icon: Sparkles, price: 200000, descKey: 'surpriseDesc' },
  { id: 3, nameKey: 'custom', icon: Globe, priceMin: 25000, priceMax: 45000, descKey: 'customDesc' },
  { id: 4, nameKey: 'flower', icon: Flower2, price: 15000, descKey: 'flowerDesc' }
]

const STATIC_BASKETS: StaticBasket[] = [
  { id: 1, nameKey: 'birthday', icon: Gift, standard: 15000, premium: 80000, descKey: 'birthdayDesc' },
  { id: 2, nameKey: 'romantic', icon: Heart, standard: 40000, premium: 50000, descKey: 'romanticDesc' },
  { id: 3, nameKey: 'newBaby', icon: Baby, standard: 40000, premium: 80000, descKey: 'newBabyDesc' },
  { id: 4, nameKey: 'gourmet', icon: Coffee, standard: 20000, premium: 70000, descKey: 'gourmetDesc' },
  { id: 5, nameKey: 'wellness', icon: Flower2, standard: 50000, premium: 100000, descKey: 'wellnessDesc' }
]

const eventTypes: string[] = ['Birthday', 'Proposal', 'Anniversary', 'Baby Shower', 'Bridal Shower', 'Welcome Back Party', 'Other']

// Fonctions de validation
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhone = (phone: string) => {
  const digits = phone.replace(/[^0-9]/g, '')
  return digits.length >= 9 && digits.length <= 15 // accepte les formats internationaux et locaux
}

export default function ContactForm() {
  const { t } = useTranslation()
  const { data: servicesData } = useServicesSafe()
  const { data: basketsDataFromCMS } = useGiftBasketsSafe()
  const { maintenance, loading: maintenanceLoading } = useMaintenanceSafe()
  
  const [step, setStep] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [budgetError, setBudgetError] = useState<string>('')
  const [stepError, setStepError] = useState<string>('')
  const reviewRef = useRef<HTMLDivElement>(null)

  // Récupérer les packs du service Party (service id 1)
  const partyService = servicesData?.find((s: Service) => s.id === 1)
  const packs: Pack[] = partyService?.packs || []

  // Récupérer les noms traduits des baskets
  const basketsData = useMemo(() => {
    if (!basketsDataFromCMS) return STATIC_BASKETS
    return STATIC_BASKETS.map((staticBasket: StaticBasket, idx: number) => {
      const cmsBasket = basketsDataFromCMS[idx]
      return {
        ...staticBasket,
        name: cmsBasket?.name || staticBasket.nameKey,
        desc: cmsBasket?.description || staticBasket.descKey
      }
    })
  }, [basketsDataFromCMS])

  const [formData, setFormData] = useState<FormData>({
    clientName: '', clientPhone: '', clientEmail: '',
    destName: '', destPhone: '', destAddress: '', destAge: '',
    eventType: 'Birthday', eventDate: '', eventTime: '', eventLocation: '',
    selectedServices: [], selectedPacks: [], selectedBaskets: [],
    budget: 0, deliveryMethod: 'delivery',
    message: '', specialInstructions: '', isDiscreet: false, needsPersonPresent: false, additionalNotes: ''
  })

  useEffect(() => { setIsMounted(true) }, [])

  const validateStep = (stepToValidate: number): boolean => {
    setStepError('')
    
    switch(stepToValidate) {
      case 1:
        if (!formData.clientName.trim()) {
          setStepError(t('contactForm.validation.nameRequired') || 'Veuillez entrer votre nom complet')
          return false
        }
        if (!formData.clientPhone.trim()) {
          setStepError(t('contactForm.validation.phoneRequired') || 'Veuillez entrer votre numéro de téléphone WhatsApp')
          return false
        }
        if (!isValidPhone(formData.clientPhone)) {
          setStepError('Numéro de téléphone invalide. Utilisez un format comme +2507XXXXXXXX ou 07XXXXXXXX')
          return false
        }
        if (!formData.clientEmail.trim()) {
          setStepError('Veuillez entrer votre adresse email (indispensable pour recevoir votre confirmation)')
          return false
        }
        if (!isValidEmail(formData.clientEmail)) {
          setStepError('Veuillez entrer une adresse email valide, par exemple nom@domaine.com')
          return false
        }
        return true
        
      case 2:
        if (!formData.destName.trim()) {
          setStepError(t('contactForm.validation.recipientNameRequired') || 'Veuillez entrer le nom du destinataire')
          return false
        }
        if (!formData.destAddress.trim()) {
          setStepError(t('contactForm.validation.addressRequired') || 'Veuillez entrer l\'adresse de livraison')
          return false
        }
        return true
        
      case 3:
        if (!formData.eventDate) {
          setStepError(t('contactForm.validation.dateRequired') || 'Veuillez sélectionner une date')
          return false
        }
        if (!formData.eventTime) {
          setStepError(t('contactForm.validation.timeRequired') || 'Veuillez sélectionner une heure')
          return false
        }
        if (!formData.eventLocation.trim()) {
          setStepError(t('contactForm.validation.locationRequired') || 'Veuillez entrer le lieu de l\'événement')
          return false
        }
        return true
        
      case 4:
        const hasService = formData.selectedServices.length > 0
        const hasPack = formData.selectedPacks.length > 0
        const hasBasket = formData.selectedBaskets.length > 0
        if (!hasService && !hasPack && !hasBasket) {
          setStepError(t('contactForm.validation.selectService') || 'Veuillez sélectionner au moins un service, pack ou panier cadeau')
          return false
        }
        return true
        
      case 5:
        return true
        
      default:
        return true
    }
  }

  const calculateTotalPrice = useMemo(() => {
    let total = 0

    // Prix des packs Party Decoration
    formData.selectedPacks.forEach((packId: number) => {
      const pack = packs.find((p: Pack) => p.id === packId)
      if (pack) total += pack.price
    })

    // Prix des services
    if (formData.selectedServices.includes(2)) total += 200000
    if (formData.selectedServices.includes(3)) total += 35000
    if (formData.selectedServices.includes(4)) total += 15000

    // Prix des baskets
    formData.selectedBaskets.forEach((basket: { id: number; version: 'standard' | 'premium' }) => {
      const b = STATIC_BASKETS.find((bk: StaticBasket) => bk.id === basket.id)
      if (b) total += basket.version === 'standard' ? b.standard : b.premium
    })

    if (formData.deliveryMethod === 'delivery') total += 5000

    return total
  }, [formData.selectedPacks, formData.selectedServices, formData.selectedBaskets, formData.deliveryMethod, packs])

  const totalPrice = calculateTotalPrice
  const hasValidSelection = totalPrice > 0

  const handlePackToggle = (packId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedPacks: prev.selectedPacks.includes(packId)
        ? prev.selectedPacks.filter((id: number) => id !== packId)
        : [...prev.selectedPacks, packId]
    }))
  }

  const handleServiceToggle = (serviceId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id: number) => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }))
  }

  const handleBasketToggle = (basketId: number, version: 'standard' | 'premium') => {
    setFormData(prev => {
      const exists = prev.selectedBaskets.find((b: { id: number }) => b.id === basketId)
      if (exists) {
        return { ...prev, selectedBaskets: prev.selectedBaskets.filter((b: { id: number }) => b.id !== basketId) }
      } else {
        return { ...prev, selectedBaskets: [...prev.selectedBaskets, { id: basketId, version }] }
      }
    })
  }

  const updateBasketVersion = (basketId: number, version: 'standard' | 'premium') => {
    setFormData(prev => ({
      ...prev,
      selectedBaskets: prev.selectedBaskets.map((b: { id: number; version: 'standard' | 'premium' }) => 
        b.id === basketId ? { ...b, version } : b
      )
    }))
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    setFormData(prev => ({ ...prev, budget: value }))
    if (value < totalPrice && value !== 0) {
      setBudgetError(`${t('contactForm.validation.budgetRequired') || 'Budget minimum requis :'} ${totalPrice.toLocaleString()} RWF`)
    } else {
      setBudgetError('')
    }
  }

  const downloadPDF = async () => {
    if (!isMounted || !reviewRef.current) return
    const html2pdf = (await import('html2pdf.js')).default
    const opt = { 
      margin: [10, 10, 10, 10] as [number, number, number, number], 
      filename: `commande_${formData.clientName || 'client'}_${Date.now()}.pdf`, 
      image: { type: 'jpeg', quality: 0.98 }, 
      html2canvas: { scale: 2 }, 
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } 
    }
    try { await html2pdf().set(opt).from(reviewRef.current).save() } 
    catch (error) { console.error('Erreur PDF:', error) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasValidSelection) { alert(t('contactForm.validation.selectService') || 'Veuillez sélectionner au moins un service ou un panier cadeau'); return }
    if (formData.budget > 0 && formData.budget < totalPrice) { alert(`${t('contactForm.validation.budgetRequired') || 'Le budget minimum est de'} ${totalPrice.toLocaleString()} RWF`); return }
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/functions/submit-order', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ ...formData, totalPrice, budget: formData.budget || totalPrice }) 
      })
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

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }
  
  const prevStep = () => setStep(step - 1)
  const goToStep = (targetStep: number) => setStep(targetStep)

  if (isSubmitted) {
    return (
      <section id="contact" className="py-24 bg-white">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto text-center p-12 bg-green-50 rounded-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-green-600" /></div>
            <h3 className="text-2xl font-bold text-dark mb-2">{t('contactForm.success.title') || 'Demande envoyée !'}</h3>
            <p className="text-gray-600 mb-4">{t('contactForm.success.message') || 'Merci pour votre confiance. Nous vous répondrons dans les 30 minutes sur WhatsApp.'}</p>
            <p className="text-sm text-gray-500">{t('contactForm.success.pdf') || 'Votre récapitulatif PDF va être téléchargé automatiquement.'}</p>
          </motion.div>
        </div>
      </section>
    )
  }

  const ReviewContent = () => (
    <div ref={reviewRef} className="bg-white p-6 rounded-xl space-y-4" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="text-center border-b pb-4"><h2 className="text-2xl font-bold text-primary">LoveExpress</h2><p className="text-gray-500 text-sm">{t('contactForm.review.title') || 'Récapitulatif de votre commande'}</p><p className="text-xs text-gray-400 mt-1">{t('contactForm.review.date') || 'Date'}: {new Date().toLocaleDateString()}</p></div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">{t('contactForm.review.clientInfo') || 'Informations client'}</h3><div className="grid grid-cols-2 gap-2 text-sm"><p><span className="text-gray-500">{t('contactForm.fields.fullName') || 'Nom'}:</span> {formData.clientName || t('common.notSpecified') || 'Non renseigné'}</p><p><span className="text-gray-500">{t('contactForm.fields.phone') || 'Téléphone'}:</span> {formData.clientPhone || t('common.notSpecified') || 'Non renseigné'}</p></div></div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">{t('contactForm.review.recipientInfo') || 'Informations destinataire'}</h3><div className="grid grid-cols-2 gap-2 text-sm"><p><span className="text-gray-500">{t('contactForm.fields.recipientName') || 'Nom destinataire'}:</span> {formData.destName || t('common.notSpecified') || 'Non renseigné'}</p><p><span className="text-gray-500">{t('contactForm.fields.deliveryAddress') || 'Adresse'}:</span> {formData.destAddress || t('common.notSpecified') || 'Non renseignée'}</p></div></div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">{t('contactForm.review.eventInfo') || 'Informations événement'}</h3><div className="grid grid-cols-2 gap-2 text-sm"><p><span className="text-gray-500">{t('contactForm.fields.eventType') || 'Type'}:</span> {formData.eventType}</p><p><span className="text-gray-500">{t('contactForm.fields.eventDate') || 'Date'}:</span> {formData.eventDate || t('common.notSpecified') || 'Non renseignée'}</p></div></div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">{t('contactForm.review.services') || 'Services & Packs'}</h3>
        <ul className="text-sm space-y-1">
          {formData.selectedPacks.map((packId: number) => {
            const pack = packs.find((p: Pack) => p.id === packId)
            return <li key={packId}>• {pack?.name} : {pack?.price.toLocaleString()} RWF</li>
          })}
          {formData.selectedServices.includes(2) && <li>• {t('services.surprise.title') || 'Surprise Planner'} : 200 000 RWF</li>}
          {formData.selectedServices.includes(3) && <li>• {t('services.custom.title') || 'Custom Website'} : 35 000 RWF ({t('common.estimate') || 'estimation'})</li>}
          {formData.selectedServices.includes(4) && <li>• {t('services.flower.title') || 'Flower Bouquet'} : 15 000 RWF</li>}
          {formData.selectedBaskets.map((b: { id: number; version: 'standard' | 'premium' }) => {
            const basket = STATIC_BASKETS.find((bk: StaticBasket) => bk.id === b.id)
            const basketName = basketsDataFromCMS?.find((bk: any) => bk.id === b.id)?.name || basket?.nameKey
            return <li key={b.id}>• {basketName} ({b.version}) : {b.version === 'standard' ? basket?.standard.toLocaleString() : basket?.premium.toLocaleString()} RWF</li>
          })}
        </ul>
      </div>
      <div><h3 className="font-semibold text-dark border-l-4 border-primary pl-3 mb-3">{t('contactForm.review.delivery') || 'Livraison'}</h3><p className="text-sm">{formData.deliveryMethod === 'delivery' ? (t('contactForm.deliveryMethods.delivery') || 'Livraison à domicile') + ' (+5 000 RWF)' : (t('contactForm.deliveryMethods.pickup') || 'Retrait au bureau')}</p></div>
      <div className="border-t pt-3"><div className="flex justify-between"><span className="font-semibold">{t('contactForm.review.total') || 'Total'} :</span><span className="font-bold text-primary text-lg">{totalPrice.toLocaleString()} RWF</span></div></div>
      {formData.message && (<div className="bg-primaryLight p-3 rounded-lg"><p className="text-sm italic">"{formData.message}"</p></div>)}
      <div className="text-center text-xs text-gray-400 pt-4 border-t"><p>LoveSurpriseExpress - {t('footer.tagline') || 'We deliver love and kindness'}</p><p>Tel: +250 799 366 007</p></div>
    </div>
  )

  // Rendu conditionnel via la variable showMaintenance (pas de return conditionnel avant les hooks)
  const showMaintenance = !maintenanceLoading && maintenance.enabled === true

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Heart size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">{t('contactForm.badge') || 'Devis gratuit'}</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
            {t('contactForm.title') || 'Planifiez Votre Surprise'}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {t('contactForm.subtitle') || 'Remplissez ce formulaire et nous nous occupons de tout'}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {showMaintenance ? (
            <MaintenanceBanner 
              message={maintenance.message || "Le formulaire de commande est temporairement désactivé pour maintenance."}
              endDate={maintenance.endDate}
              contactEmail={maintenance.contactEmail}
              showWhatsApp={maintenance.showWhatsApp !== false}
            />
          ) : (
            <>
              <div className="mb-8">
                <div className="flex justify-between mb-2 text-sm text-gray-500">
                  <span>{t('contactForm.step') || 'Étape'} {step} / 6</span>
                  <span>{Math.round((step / 6) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-primary" initial={{ width: `${((step - 1) / 6) * 100}%` }} animate={{ width: `${((step - 1) / 6) * 100}%` }} transition={{ duration: 0.3 }} />
                </div>
              </div>

              {stepError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {stepError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                      <h3 className="text-2xl font-bold text-dark mb-6">{t('contactForm.steps.0') || 'Qui êtes-vous ?'}</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.fullName') || 'Nom complet'} <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary" placeholder={t('contactForm.placeholders.fullName') || 'Votre nom'} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.phone') || 'Téléphone WhatsApp'} <span className="text-red-500">*</span></label>
                        <input type="tel" value={formData.clientPhone} onChange={(e) => setFormData({...formData, clientPhone: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" placeholder={t('contactForm.placeholders.phone') || '+250 7XX XXX XXX'} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.email') || 'Email'} <span className="text-red-500">*</span></label>
                        <input type="email" value={formData.clientEmail} onChange={(e) => setFormData({...formData, clientEmail: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" placeholder={t('contactForm.placeholders.email') || 'exemple@email.com'} />
                        <p className="text-xs text-gray-400 mt-1">📧 Votre email est essentiel pour recevoir votre confirmation de commande.</p>
                      </div>
                      <button type="button" onClick={nextStep} className="btn-primary w-full">{t('contactForm.buttons.next') || 'Suivant →'}</button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                      <h3 className="text-2xl font-bold text-dark mb-6">{t('contactForm.steps.1') || 'Qui recevra la surprise ?'}</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.recipientName') || 'Nom du destinataire'} <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.destName} onChange={(e) => setFormData({...formData, destName: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" placeholder={t('contactForm.placeholders.recipientName') || 'Nom de la personne'} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.recipientPhone') || 'Téléphone'} <span className="text-gray-400 text-xs">({t('common.optional') || 'optionnel'})</span></label>
                        <input type="tel" value={formData.destPhone} onChange={(e) => setFormData({...formData, destPhone: e.target.value})} className="w-full px-4 py-3 border rounded-lg" placeholder={t('contactForm.placeholders.recipientPhone') || '+250 7XX XXX XXX'} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.deliveryAddress') || 'Adresse de livraison'} <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.destAddress} onChange={(e) => setFormData({...formData, destAddress: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" placeholder={t('contactForm.placeholders.deliveryAddress') || 'Rue, quartier, ville'} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.age') || 'Âge'} <span className="text-gray-400 text-xs">({t('common.optional') || 'optionnel'})</span></label>
                        <input type="text" value={formData.destAge} onChange={(e) => setFormData({...formData, destAge: e.target.value})} className="w-full px-4 py-3 border rounded-lg" placeholder={t('contactForm.placeholders.age') || 'Ex: 25 ans'} />
                      </div>
                      <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">{t('contactForm.buttons.back') || 'Retour'}</button><button type="button" onClick={nextStep} className="btn-primary flex-1">{t('contactForm.buttons.next') || 'Suivant →'}</button></div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                      <h3 className="text-2xl font-bold text-dark mb-6">{t('contactForm.steps.2') || 'Quel événement ?'}</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.eventType') || 'Type'} <span className="text-red-500">*</span></label>
                        <select value={formData.eventType} onChange={(e) => setFormData({...formData, eventType: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
                          {eventTypes.map((type: string) => <option key={type}>{type}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.eventDate') || 'Date'} <span className="text-red-500">*</span></label>
                        <input type="date" value={formData.eventDate} onChange={(e) => setFormData({...formData, eventDate: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.eventTime') || 'Heure'} <span className="text-red-500">*</span></label>
                        <input type="time" value={formData.eventTime} onChange={(e) => setFormData({...formData, eventTime: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.eventLocation') || 'Lieu exact'} <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.eventLocation} onChange={(e) => setFormData({...formData, eventLocation: e.target.value})} required className="w-full px-4 py-3 border rounded-lg" placeholder={t('contactForm.placeholders.eventLocation') || 'Nom du lieu, adresse précise'} />
                      </div>
                      <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">{t('contactForm.buttons.back') || 'Retour'}</button><button type="button" onClick={nextStep} className="btn-primary flex-1">{t('contactForm.buttons.next') || 'Suivant →'}</button></div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                      <h3 className="text-2xl font-bold text-dark mb-6">{t('contactForm.steps.3') || 'Que souhaitez-vous commander ?'}</h3>
                      
                      {/* Party Decoration - avec packs dynamiques */}
                      <div className="border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3"><PartyPopper size={18} className="text-primary" /><h4 className="font-semibold text-dark">{t('services.party.title') || 'Party Decoration'}</h4></div>
                        <div className="space-y-2">
                          {packs.map((pack: Pack) => (
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
                        <div className="flex items-center gap-3"><Sparkles size={18} className="text-primary" /><div><span className="font-medium">{t('services.surprise.title') || 'Surprise Planner'}</span><p className="text-xs text-gray-500">{t('services.surprise.description') || 'Planification complète + coordination sur place'}</p></div></div>
                        <div className="flex items-center gap-4"><span className="text-primary font-bold">200 000 RWF</span><input type="checkbox" checked={formData.selectedServices.includes(2)} onChange={() => handleServiceToggle(2)} className="w-4 h-4 text-primary rounded" /></div>
                      </label>

                      {/* Custom Website */}
                      <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${formData.selectedServices.includes(3) ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3"><Globe size={18} className="text-primary" /><div><span className="font-medium">{t('services.custom.title') || 'Custom Website'}</span><p className="text-xs text-gray-500">{t('services.custom.description') || 'Site personnalisé pour votre événement'}</p></div></div>
                        <div className="flex items-center gap-4"><span className="text-primary font-bold">25 000 - 45 000 RWF</span><input type="checkbox" checked={formData.selectedServices.includes(3)} onChange={() => handleServiceToggle(3)} className="w-4 h-4 text-primary rounded" /></div>
                      </label>

                      {/* Flower Bouquet */}
                      <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${formData.selectedServices.includes(4) ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3"><Flower2 size={18} className="text-primary" /><div><span className="font-medium">{t('services.flower.title') || 'Flower Bouquet'}</span><p className="text-xs text-gray-500">{t('services.flower.description') || 'Bouquet de fleurs fraîches'}</p></div></div>
                        <div className="flex items-center gap-4"><span className="text-primary font-bold">15 000 RWF</span><input type="checkbox" checked={formData.selectedServices.includes(4)} onChange={() => handleServiceToggle(4)} className="w-4 h-4 text-primary rounded" /></div>
                      </label>

                      {/* Gift Baskets - avec noms traduits */}
                      <div className="border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3"><Gift size={18} className="text-primary" /><h4 className="font-semibold text-dark">{t('giftbaskets.title') || 'Gift Baskets'}</h4></div>
                        <div className="space-y-3">
                          {basketsData.map((basket: StaticBasket & { name?: string; desc?: string }) => (
                            <div key={basket.id} className={`p-3 rounded-lg border transition ${formData.selectedBaskets.some((b: { id: number }) => b.id === basket.id) ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <basket.icon size={16} className="text-primary" />
                                  <span className="font-medium">{t(`giftbaskets.${basket.nameKey.toLowerCase()}`) || basket.name}</span>
                                </div>
                                <input type="checkbox" checked={formData.selectedBaskets.some((b: { id: number }) => b.id === basket.id)} onChange={() => handleBasketToggle(basket.id, 'standard')} className="w-4 h-4 text-primary rounded" />
                              </div>
                              {formData.selectedBaskets.some((b: { id: number }) => b.id === basket.id) && (
                                <div className="flex gap-3 ml-6 mt-2">
                                  <label className="flex items-center gap-2">
                                    <input type="radio" name={`version-${basket.id}`} checked={formData.selectedBaskets.find((b: { id: number }) => b.id === basket.id)?.version === 'standard'} onChange={() => updateBasketVersion(basket.id, 'standard')} className="w-4 h-4 text-primary" />
                                    <span className="text-sm">{t('giftbaskets.standard') || 'Standard'}: {basket.standard.toLocaleString()} RWF</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <input type="radio" name={`version-${basket.id}`} checked={formData.selectedBaskets.find((b: { id: number }) => b.id === basket.id)?.version === 'premium'} onChange={() => updateBasketVersion(basket.id, 'premium')} className="w-4 h-4 text-primary" />
                                    <span className="text-sm">{t('giftbaskets.premium') || 'Premium'}: {basket.premium.toLocaleString()} RWF</span>
                                  </label>
                                </div>
                              )}
                              <p className="text-xs text-gray-500 ml-6 mt-1">{t(`giftbaskets.${basket.nameKey}Desc`) || basket.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.message') || 'Message sur la carte'} <span className="text-gray-400 text-xs">({t('common.optional') || 'optionnel'})</span></label>
                        <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={3} className="w-full px-4 py-3 border rounded-lg" placeholder={t('contactForm.placeholders.message') || 'Joyeux anniversaire ! Je t\'aime'} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.specialInstructions') || 'Instructions spéciales'} <span className="text-gray-400 text-xs">({t('common.optional') || 'optionnel'})</span></label>
                        <textarea value={formData.specialInstructions} onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})} rows={2} className="w-full px-4 py-3 border rounded-lg" placeholder={t('contactForm.placeholders.specialInstructions') || 'Thème, couleurs, préférences...'} />
                      </div>

                      <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">{t('contactForm.buttons.back') || 'Retour'}</button><button type="button" onClick={nextStep} className="btn-primary flex-1">{t('contactForm.buttons.next') || 'Suivant →'}</button></div>
                    </motion.div>
                  )}

                  {step === 5 && (
                    <motion.div key="step5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                      <h3 className="text-2xl font-bold text-dark mb-6">{t('contactForm.steps.4') || 'Livraison & Budget'}</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.deliveryMethod') || 'Mode de livraison'}</label>
                        <div className="grid grid-cols-2 gap-4">
                          <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${formData.deliveryMethod === 'delivery' ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}>
                            <input type="radio" name="deliveryMethod" value="delivery" checked={formData.deliveryMethod === 'delivery'} onChange={() => setFormData({...formData, deliveryMethod: 'delivery'})} className="w-4 h-4 text-primary" />
                            <div><span className="font-semibold block">{t('contactForm.deliveryMethods.delivery') || 'Livraison à domicile'}</span><span className="text-xs text-gray-500">+5 000 RWF</span></div>
                          </label>
                          <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${formData.deliveryMethod === 'pickup' ? 'border-primary bg-primaryLight' : 'border-gray-200'}`}>
                            <input type="radio" name="deliveryMethod" value="pickup" checked={formData.deliveryMethod === 'pickup'} onChange={() => setFormData({...formData, deliveryMethod: 'pickup'})} className="w-4 h-4 text-primary" />
                            <div><span className="font-semibold block">{t('contactForm.deliveryMethods.pickup') || 'Retrait au bureau'}</span><span className="text-xs text-gray-500">{t('contactForm.deliveryMethods.pickupFree') || 'Gratuit'}</span></div>
                          </label>
                        </div>
                      </div>

                      <div className="bg-primaryLight rounded-xl p-5">
                        <h4 className="font-semibold text-dark mb-3">{t('contactForm.review.services') || 'Récapitulatif des services'}</h4>
                        <div className="space-y-2 text-sm">
                          {formData.selectedPacks.map((packId: number) => {
                            const pack = packs.find((p: Pack) => p.id === packId)
                            return <div key={packId} className="flex justify-between"><span>{pack?.name}</span><span className="font-bold">{pack?.price.toLocaleString()} RWF</span></div>
                          })}
                          {formData.selectedServices.includes(2) && <div className="flex justify-between"><span>{t('services.surprise.title') || 'Surprise Planner'}</span><span className="font-bold">200 000 RWF</span></div>}
                          {formData.selectedServices.includes(3) && <div className="flex justify-between"><span>{t('services.custom.title') || 'Custom Website'}</span><span className="font-bold">~35 000 RWF</span></div>}
                          {formData.selectedServices.includes(4) && <div className="flex justify-between"><span>{t('services.flower.title') || 'Flower Bouquet'}</span><span className="font-bold">15 000 RWF</span></div>}
                          {formData.selectedBaskets.map((b: { id: number; version: 'standard' | 'premium' }) => {
                            const basket = STATIC_BASKETS.find((bk: StaticBasket) => bk.id === b.id)
                            const basketName = basketsDataFromCMS?.find((bk: any) => bk.id === b.id)?.name || basket?.nameKey
                            return <div key={b.id} className="flex justify-between"><span>{basketName} ({b.version})</span><span className="font-bold">{b.version === 'standard' ? basket?.standard.toLocaleString() : basket?.premium.toLocaleString()} RWF</span></div>
                          })}
                          {formData.deliveryMethod === 'delivery' && <div className="flex justify-between"><span>{t('contactForm.deliveryMethods.delivery') || 'Livraison'}</span><span className="font-bold">+5 000 RWF</span></div>}
                          <div className="border-t pt-2 mt-2 flex justify-between"><span className="font-bold">{t('contactForm.review.total') || 'Total'} :</span><span className="font-bold text-primary text-lg">{totalPrice.toLocaleString()} RWF</span></div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.budget') || 'Votre budget'} (RWF) <span className="text-gray-400 text-xs">({t('common.optional') || 'optionnel'} - {t('contactForm.budgetHint') || 'laisse vide pour utiliser le total'})</span></label>
                        <input type="number" value={formData.budget || ''} onChange={handleBudgetChange} className="w-full px-4 py-3 border rounded-lg" placeholder={totalPrice.toString()} />
                        {budgetError && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{budgetError}</p>}
                        <p className="text-xs text-gray-400 mt-1">{t('contactForm.budgetSuggestion') || 'Budget minimum suggéré'} : {totalPrice.toLocaleString()} RWF</p>
                      </div>

                      <div className="flex gap-4"><button type="button" onClick={prevStep} className="btn-secondary flex-1">{t('contactForm.buttons.back') || 'Retour'}</button><button type="button" onClick={nextStep} className="btn-primary flex-1">{t('contactForm.buttons.next') || 'Suivant →'}</button></div>
                    </motion.div>
                  )}

                  {step === 6 && (
                    <motion.div key="step6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                      <h3 className="text-2xl font-bold text-dark mb-6">{t('contactForm.steps.5') || 'Vérification'}</h3>
                      
                      <ReviewContent />
                      
                      <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-primaryLight">
                        <input type="checkbox" checked={formData.isDiscreet} onChange={(e) => setFormData({...formData, isDiscreet: e.target.checked})} className="w-5 h-5 text-primary rounded" />
                        <span>{t('contactForm.options.discreet') || 'Surprise discrète (ne pas révéler l\'expéditeur)'} <span className="text-gray-400 text-xs">({t('common.optional') || 'optionnel'})</span></span>
                      </label>
                      <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-primaryLight">
                        <input type="checkbox" checked={formData.needsPersonPresent} onChange={(e) => setFormData({...formData, needsPersonPresent: e.target.checked})} className="w-5 h-5 text-primary rounded" />
                        <span>{t('contactForm.options.needsPersonPresent') || 'Le destinataire doit être présent lors de la livraison'} <span className="text-gray-400 text-xs">({t('common.optional') || 'optionnel'})</span></span>
                      </label>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactForm.fields.additionalNotes') || 'Notes supplémentaires'} <span className="text-gray-400 text-xs">({t('common.optional') || 'optionnel'})</span></label>
                        <textarea value={formData.additionalNotes} onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})} rows={2} className="w-full px-4 py-3 border rounded-lg" placeholder={t('contactForm.placeholders.additionalNotes') || 'Information importante...'} />
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex gap-4">
                          <button type="button" onClick={() => goToStep(1)} className="btn-secondary flex-1">{t('contactForm.buttons.modify') || 'Modifier'}</button>
                          <button type="button" onClick={downloadPDF} className="bg-gray-100 text-gray-700 px-4 py-3 rounded-full font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2 flex-1"><Download size={18} /> {t('contactForm.buttons.downloadPDF') || 'Télécharger PDF'}</button>
                        </div>
                        <button type="submit" disabled={isSubmitting || (!hasValidSelection) || (formData.budget > 0 && formData.budget < totalPrice)} className="btn-primary w-full">{isSubmitting ? (t('common.loading') || 'Envoi...') : (t('contactForm.buttons.confirm') || 'Confirmer et envoyer')}</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}