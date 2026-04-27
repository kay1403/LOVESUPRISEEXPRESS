'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Star, Heart, Camera, X } from 'lucide-react'

export default function AvisForm() {
  const [note, setNote] = useState(5)
  const [message, setMessage] = useState('')
  const [nom, setNom] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La photo ne doit pas dépasser 5MB')
        return
      }
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      setError('Veuillez écrire votre témoignage')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      let photoBase64 = null
      if (photo) {
        const reader = new FileReader()
        photoBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(photo)
        })
      }

      const response = await fetch('/functions/submit-testimonial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note,
          message,
          nom: nom.trim() || 'Client LoveExpress',
          photoBase64,
          hasPhoto: !!photo
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsSubmitted(true)
        setNote(5)
        setMessage('')
        setNom('')
        setPhoto(null)
        setPhotoPreview(null)
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        setError(data.error || 'Erreur lors de l\'envoi. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-green-600 fill-green-600" />
        </div>
        <h3 className="text-xl font-bold text-dark mb-2">Merci pour votre témoignage !</h3>
        <p className="text-gray-600">
          Votre avis sera publié après validation par notre équipe (sous 24-48h).
        </p>
      </motion.div>
    )
  }

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Star size={14} className="text-primary fill-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Votre avis compte</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
            Donnez votre avis
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Partagez votre expérience LoveExpress avec la communauté
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-primaryLight rounded-2xl p-8 shadow-sm"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Note étoiles */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Votre note *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNote(s)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${s <= note ? 'fill-accent text-accent' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre témoignage *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="J'ai adoré ma surprise, tout était parfait ! Merci LoveExpress ❤️"
              required
            />
          </div>

          {/* Nom (optionnel) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre nom (optionnel)
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Marie, Jean, ..."
            />
          </div>

          {/* Photo (optionnelle) */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ajouter une photo (optionnelle)
            </label>
            {photoPreview ? (
              <div className="relative inline-block">
                <img src={photoPreview} alt="Aperçu" className="w-32 h-32 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Cliquez pour ajouter une photo</p>
                  <p className="text-xs text-gray-400">JPG, PNG (max 5MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
            )}
          </div>

          {/* Bouton envoyer */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              'Envoi en cours...'
            ) : (
              <>
                <Heart size={18} />
                Envoyer mon témoignage
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Votre témoignage sera publié après validation par notre équipe
          </p>
        </motion.form>
      </div>
    </section>
  )
}