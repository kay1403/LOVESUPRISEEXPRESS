// lib/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Traductions françaises
const fr = {
  translation: {
    common: {
      loading: 'Chargement...',
      back: 'Retour',
      optional: 'optionnel',
      notSpecified: 'Non renseigné',
      estimate: 'estimation',
      included: 'Inclus',
      description: 'Description',
      close: 'Fermer',
      error: 'Une erreur est survenue',
      viewDetails: 'Voir détails'
    },
    hero: {
      loveSurprise: 'Love Surprise',
      express: 'Express',
      title: 'LoveSupriseExpress',
      subtitle: 'Nous créons des moments de surprise inoubliables',
      description: 'Distribution de tout type d\'articles de fête · Accessoires pour ballons · Gaz hélium · Planificateur de surprises',
      cta: 'Planifier votre surprise',
      stats: {
        surprises: '+250 surprises organisées',
        delivery: 'Livraison à Kigali',
        quote: 'Devis gratuit'
      }
    },
    services: {
      badge: 'Nos Prestations',
      title: 'Nos Services',
      subtitle: 'Tout ce dont vous avez besoin pour créer le moment de surprise parfait',
      packsTitle: 'Nos Packs Décoration',
      includes: 'Inclus',
      options: 'Options',
      preparation: 'Préparation',
      coverage: 'Couverture',
      balloons: 'Ballons & Hélium',
      decoration: 'Décoration de fête',
      planner: 'Planificateur de surprises',
      website: 'Site web personnalisé',
      flowers: 'Bouquet de fleurs',
      giftbasket: 'Paniers cadeaux',
      learnMore: 'En savoir plus',
      requestQuote: 'Demander un devis',
      close: 'Fermer',
      buttons: {
        details: 'Détails',
        getQuote: 'Demander un devis'
      },
      party: {
        title: 'Party Decoration',
        description: 'Décoration de fête sur mesure'
      },
      surprise: {
        title: 'Surprise Planner',
        description: 'Planification complète + coordination sur place'
      },
      custom: {
        title: 'Custom Website',
        description: 'Site web personnalisé pour votre événement'
      },
      flower: {
        title: 'Flower Bouquet',
        description: 'Bouquet de fleurs fraîches'
      },
      gift: {
        title: 'Gift Baskets',
        description: 'Paniers cadeaux personnalisables'
      }
    },
    giftbaskets: {
      badge: 'Cadeaux sur mesure',
      title: 'Nos Paniers Cadeaux',
      subtitle: 'Des cadeaux soigneusement sélectionnés pour chaque occasion',
      popular: 'Populaire',
      viewBasket: 'Voir le panier',
      viewDetails: 'Détails',
      includes: 'Contenu du panier',
      standard: 'Standard',
      premium: 'Premium',
      from: 'À partir de',
      order: 'Commander',
      birthday: 'Anniversaire',
      romantic: 'Romantique',
      newbaby: 'Nouveau-né',
      gourmet: 'Gourmet',
      wellness: 'Bien-être',
      birthdayDesc: 'Mini gâteau, bougie, carte, jus de fruit',
      romanticDesc: 'Chocolat, bougies, lettre, fleurs',
      newBabyDesc: 'Vêtements, couches, soin, doudou',
      gourmetDesc: 'Biscuits, fruits, chocolat, jus, bonbons',
      wellnessDesc: 'Thé, huiles, savon, masques, parfum, crème'
    },
    gallery: {
      badge: 'Ils nous ont fait confiance',
      title: 'Avis Clients',
      subtitle: 'Découvrez les sourires et la joie de nos clients après leurs surprises',
      empty: 'Aucun témoignage publié pour le moment',
      emptyCTA: 'Soyez le premier à partager votre expérience !',
      viewAll: 'Avis Clients'
    },
    about: {
      ourStory: 'Notre histoire',
      title: 'Derrière chaque surprise, une passionnée',
      description1: 'Je m\'appelle EYEANG Love, fondatrice de LoveExpress. Je transforme les moments ordinaires en souvenirs extraordinaires.',
      description2: 'Ce qui me motive chaque jour : voir l\'étincelle dans les yeux de ceux qui reçoivent une surprise et la joie de ceux qui offrent. Chaque projet est unique, chaque détail compte.',
      noImages: 'Aucune image disponible',
      qualities: {
        creativity: 'Créativité illimitée',
        discretion: 'Discrétion absolue',
        execution: 'Exécution parfaite',
        details: 'Attention aux détails'
      },
      stats: {
        satisfied: 'Clients satisfaits',
        passion: 'Passion et dévouement',
        availability: 'Disponibilité',
        exclusive: 'Service exclusif',
        surprises: 'Surprises organisées',
        experience: 'Années d\'expérience'
      }
    },
    realizations: {
      title: 'Nos Réalisations',
      subtitle: 'Découvrez nos dernières créations',
      viewMore: 'Voir plus de réalisations'
    },
    avisForm: {
      badge: 'Votre avis compte',
      title: 'Donnez votre avis',
      subtitle: 'Partagez votre expérience LoveExpress avec la communauté',
      rating: 'Votre note',
      testimonial: 'Votre témoignage',
      name: 'Votre nom',
      photo: 'Ajouter une photo',
      photoHint: 'Cliquez pour ajouter une photo',
      photoLimit: 'JPG, PNG (max 5MB)',
      photoLimitError: 'La photo ne doit pas dépasser 5MB',
      messageRequired: 'Veuillez écrire votre témoignage',
      submitError: 'Erreur lors de l\'envoi. Veuillez réessayer.',
      submit: 'Envoyer mon témoignage',
      footerNote: 'Votre témoignage sera publié après validation par notre équipe',
      testimonialPlaceholder: "J'ai adoré ma surprise, tout était parfait ! Merci LoveExpress ❤️",
      namePlaceholder: 'Marie, Jean, ...',
      success: {
        title: 'Merci pour votre témoignage !',
        message: 'Votre avis sera publié après validation par notre équipe (sous 24-48h).'
      }
    },
    contactForm: {
      badge: 'Devis gratuit',
      title: 'Planifiez Votre Surprise',
      subtitle: 'Remplissez ce formulaire et nous nous occupons de tout',
      step: 'Étape',
      budgetHint: 'laisse vide pour utiliser le total',
      budgetSuggestion: 'Budget minimum suggéré',
      steps: {
        0: 'Qui êtes-vous ?',
        1: 'Qui recevra la surprise ?',
        2: 'Quel événement ?',
        3: 'Que souhaitez-vous commander ?',
        4: 'Livraison & Budget',
        5: 'Vérification'
      },
      fields: {
        fullName: 'Nom complet',
        phone: 'Téléphone WhatsApp',
        email: 'Email',
        recipientName: 'Nom du destinataire',
        recipientPhone: 'Téléphone',
        deliveryAddress: 'Adresse de livraison',
        age: 'Âge',
        eventType: 'Type',
        eventDate: 'Date',
        eventTime: 'Heure',
        eventLocation: 'Lieu exact',
        message: 'Message sur la carte',
        specialInstructions: 'Instructions spéciales',
        deliveryMethod: 'Mode de livraison',
        budget: 'Votre budget',
        additionalNotes: 'Notes supplémentaires'
      },
      placeholders: {
        fullName: 'Votre nom',
        phone: '+250 7XX XXX XXX',
        email: 'exemple@email.com',
        recipientName: 'Nom de la personne',
        recipientPhone: '+250 7XX XXX XXX',
        deliveryAddress: 'Rue, quartier, ville',
        age: 'Ex: 25 ans',
        eventLocation: 'Nom du lieu, adresse précise',
        message: 'Joyeux anniversaire ! Je t\'aime',
        specialInstructions: 'Thème, couleurs, préférences...',
        additionalNotes: 'Information importante...'
      },
      deliveryMethods: {
        delivery: 'Livraison à domicile',
        pickup: 'Retrait au bureau',
        pickupFree: 'Gratuit'
      },
      options: {
        discreet: 'Surprise discrète (ne pas révéler l\'expéditeur)',
        needsPersonPresent: 'Le destinataire doit être présent lors de la livraison'
      },
      buttons: {
        next: 'Suivant →',
        back: 'Retour',
        modify: 'Modifier',
        downloadPDF: 'Télécharger PDF',
        confirm: 'Confirmer et envoyer'
      },
      validation: {
        nameRequired: 'Veuillez entrer votre nom complet',
        phoneRequired: 'Veuillez entrer votre numéro de téléphone WhatsApp',
        recipientNameRequired: 'Veuillez entrer le nom du destinataire',
        addressRequired: 'Veuillez entrer l\'adresse de livraison',
        dateRequired: 'Veuillez sélectionner une date',
        timeRequired: 'Veuillez sélectionner une heure',
        locationRequired: 'Veuillez entrer le lieu de l\'événement',
        selectService: 'Veuillez sélectionner au moins un service, pack ou panier cadeau',
        budgetRequired: 'Budget minimum requis :',
         invalidPhone: 'Numéro de téléphone invalide. Utilisez un format comme +2507XXXXXXXX ou 07XXXXXXXX',
  emailRequired: 'Veuillez entrer votre adresse email (indispensable pour recevoir votre confirmation)',
  invalidEmail: 'Veuillez entrer une adresse email valide, par exemple nom@domaine.com'

      },
      review: {
        title: 'Récapitulatif de votre commande',
        date: 'Date',
        clientInfo: 'Informations client',
        recipientInfo: 'Informations destinataire',
        eventInfo: 'Informations événement',
        services: 'Services & Packs',
        delivery: 'Livraison',
        total: 'Total'
      },
      success: {
        title: 'Demande envoyée !',
        message: 'Merci pour votre confiance. Nous vous répondrons dans les 30 minutes sur WhatsApp.',
        pdf: 'Votre récapitulatif PDF va être téléchargé automatiquement.'
      }
    },
    footer: {
      contact: 'Contact',
      services: 'Services',
      hours: 'Horaires',
      tagline: 'We deliver love and kindness. Créons ensemble des moments inoubliables.',
      hoursDetail: 'Lundi - Samedi: 9h - 19h',
      sunday: 'Dimanche: Sur rendez-vous',
      delivery247: 'Livraison 24/24 sur demande',
      rights: 'Tous droits réservés',
      developedBy: "Développé par"

    },
    maintenance: {
      title: 'Formulaire temporairement indisponible',
      expectedEnd: 'Reprise estimée',
      contactWhatsApp: 'Nous contacter sur WhatsApp',
      sendEmail: 'Envoyer un email',
      callUs: 'Nous appeler'
    }
  }
}

// Traductions anglaises
const en = {
  translation: {
    common: {
      loading: 'Loading...',
      back: 'Back',
      optional: 'optional',
      notSpecified: 'Not specified',
      estimate: 'estimate',
      included: 'Included',
      description: 'Description',
      close: 'Close',
      error: 'An error occurred',
      viewDetails: 'View details'
    },
    hero: {
      loveSurprise: 'Love Surprise',
      express: 'Express',
      title: 'LoveSurpriseExpress',
      subtitle: 'We create unforgettable surprise moments',
      description: 'Distribution of all kinds of party items · Balloon accessories · Helium gas · Surprise planner',
      cta: 'Plan your surprise',
      stats: {
        surprises: '+250 surprises organized',
        delivery: 'Delivery in Kigali',
        quote: 'Free quote'
      }
    },
    services: {
      badge: 'Our Services',
      title: 'Our Services',
      subtitle: 'Everything you need to create the perfect surprise moment',
      packsTitle: 'Decoration Packs',
      includes: 'Includes',
      options: 'Options',
      preparation: 'Preparation',
      coverage: 'Coverage',
      balloons: 'Balloons & Helium',
      decoration: 'Party Decoration',
      planner: 'Surprise Planner',
      website: 'Custom Website',
      flowers: 'Flower Bouquet',
      giftbasket: 'Gift Baskets',
      learnMore: 'Learn more',
      requestQuote: 'Request a quote',
      close: 'Close',
      buttons: {
        details: 'Details',
        getQuote: 'Request a quote'
      },
      party: {
        title: 'Party Decoration',
        description: 'Custom party decoration'
      },
      surprise: {
        title: 'Surprise Planner',
        description: 'Complete planning + on-site coordination'
      },
      custom: {
        title: 'Custom Website',
        description: 'Custom website for your event'
      },
      flower: {
        title: 'Flower Bouquet',
        description: 'Fresh flower bouquet'
      },
      gift: {
        title: 'Gift Baskets',
        description: 'Customizable gift baskets'
      }
    },
    giftbaskets: {
      badge: 'Custom gifts',
      title: 'Our Gift Baskets',
      subtitle: 'Carefully curated gifts for every occasion',
      popular: 'Popular',
      viewBasket: 'View basket',
      viewDetails: 'Details',
      includes: 'Basket includes',
      standard: 'Standard',
      premium: 'Premium',
      from: 'From',
      order: 'Order',
      birthday: 'Birthday',
      romantic: 'Romantic',
      newbaby: 'New Baby',
      gourmet: 'Gourmet',
      wellness: 'Wellness',
      birthdayDesc: 'Mini cake, candle, card, fruit juice',
      romanticDesc: 'Chocolate, scented candles, love letter, flowers',
      newBabyDesc: 'Baby clothes, diapers, care products, soft toy',
      gourmetDesc: 'Cookies, fruits, chocolate, juice, candies',
      wellnessDesc: 'Tea, oils, soap, face masks, perfume, cream'
    },
    gallery: {
      badge: 'They trusted us',
      title: 'Client Reviews',
      subtitle: 'Discover the smiles and joy of our clients after their surprises',
      empty: 'No testimonials published yet',
      emptyCTA: 'Be the first to share your experience!',
      viewAll: 'Client Reviews'
    },
    about: {
      ourStory: 'Our Story',
      title: 'Behind every surprise, a passionate person',
      description1: 'My name is EYEANG Love, founder of LoveExpress. I transform ordinary moments into extraordinary memories.',
      description2: 'What motivates me every day: seeing the sparkle in the eyes of those who receive a surprise and the joy of those who give. Every project is unique, every detail matters.',
      noImages: 'No images available',
      qualities: {
        creativity: 'Unlimited creativity',
        discretion: 'Absolute discretion',
        execution: 'Perfect execution',
        details: 'Attention to details'
      },
      stats: {
        satisfied: 'Satisfied clients',
        passion: 'Passion and dedication',
        availability: 'Availability',
        exclusive: 'Exclusive service',
        surprises: 'Surprises organized',
        experience: 'Years of experience'
      }
    },
    realizations: {
      title: 'Our Achievements',
      subtitle: 'Discover our latest creations',
      viewMore: 'View more achievements'
    },
    avisForm: {
      badge: 'Your opinion matters',
      title: 'Leave a Review',
      subtitle: 'Share your LoveExpress experience with the community',
      rating: 'Your rating',
      testimonial: 'Your testimonial',
      name: 'Your name',
      photo: 'Add a photo',
      photoHint: 'Click to add a photo',
      photoLimit: 'JPG, PNG (max 5MB)',
      photoLimitError: 'Photo must not exceed 5MB',
      messageRequired: 'Please write your testimonial',
      submitError: 'Error sending. Please try again.',
      submit: 'Send my testimonial',
      footerNote: 'Your review will be published after validation by our team',
      testimonialPlaceholder: "I loved my surprise, everything was perfect! Thank you LoveExpress ❤️",
      namePlaceholder: 'Marie, John, ...',
      success: {
        title: 'Thank you for your testimonial!',
        message: 'Your review will be published after validation by our team (within 24-48h).'
      }
    },
    contactForm: {
      badge: 'Free quote',
      title: 'Plan Your Surprise',
      subtitle: 'Fill out this form and we take care of everything',
      step: 'Step',
      budgetHint: 'leave empty to use total',
      budgetSuggestion: 'Minimum suggested budget',
      steps: {
        0: 'Who are you?',
        1: 'Who will receive the surprise?',
        2: 'What event?',
        3: 'What do you want to order?',
        4: 'Delivery & Budget',
        5: 'Verification'
      },
      fields: {
        fullName: 'Full name',
        phone: 'WhatsApp phone',
        email: 'Email',
        recipientName: 'Recipient name',
        recipientPhone: 'Phone',
        deliveryAddress: 'Delivery address',
        age: 'Age',
        eventType: 'Type',
        eventDate: 'Date',
        eventTime: 'Time',
        eventLocation: 'Exact location',
        message: 'Card message',
        specialInstructions: 'Special instructions',
        deliveryMethod: 'Delivery method',
        budget: 'Your budget',
        additionalNotes: 'Additional notes'
      },
      placeholders: {
        fullName: 'Your name',
        phone: '+250 7XX XXX XXX',
        email: 'example@email.com',
        recipientName: 'Person\'s name',
        recipientPhone: '+250 7XX XXX XXX',
        deliveryAddress: 'Street, neighborhood, city',
        age: 'Ex: 25 years old',
        eventLocation: 'Venue name, exact address',
        message: 'Happy birthday! I love you',
        specialInstructions: 'Theme, colors, preferences...',
        additionalNotes: 'Important information...'
      },
      deliveryMethods: {
        delivery: 'Home delivery',
        pickup: 'Pick up at office',
        pickupFree: 'Free'
      },
      options: {
        discreet: 'Discreet surprise (do not reveal the sender)',
        needsPersonPresent: 'The recipient must be present during delivery'
      },
      buttons: {
        next: 'Next →',
        back: 'Back',
        modify: 'Modify',
        downloadPDF: 'Download PDF',
        confirm: 'Confirm and send'
      },
      validation: {
        nameRequired: 'Please enter your full name',
        phoneRequired: 'Please enter your WhatsApp phone number',
        recipientNameRequired: 'Please enter the recipient\'s name',
        addressRequired: 'Please enter the delivery address',
        dateRequired: 'Please select a date',
        timeRequired: 'Please select a time',
        locationRequired: 'Please enter the event location',
        selectService: 'Please select at least one service, pack or gift basket',
        budgetRequired: 'Minimum budget required:',
        invalidPhone: 'Invalid phone number. Use a format like +2507XXXXXXXX or 07XXXXXXXX',
  emailRequired: 'Please enter your email address (required to receive your confirmation)',
  invalidEmail: 'Please enter a valid email address, e.g. name@domain.com'

      },
      review: {
        title: 'Order summary',
        date: 'Date',
        clientInfo: 'Client information',
        recipientInfo: 'Recipient information',
        eventInfo: 'Event information',
        services: 'Services & Packs',
        delivery: 'Delivery',
        total: 'Total'
      },
      success: {
        title: 'Request sent!',
        message: 'Thank you for your trust. We will answer you within 30 minutes on WhatsApp.',
        pdf: 'Your summary PDF will be downloaded automatically.'
      }
    },
    footer: {
      contact: 'Contact',
      services: 'Services',
      hours: 'Hours',
      tagline: 'We deliver love and kindness. Let\'s create unforgettable moments together.',
      hoursDetail: 'Monday - Saturday: 9am - 7pm',
      sunday: 'Sunday: By appointment',
      delivery247: '24/7 delivery on request',
      rights: 'All rights reserved',
      developedBy: "Developed by"

    },
    maintenance: {
      title: 'Contact form temporarily unavailable',
      expectedEnd: 'Estimated return',
      contactWhatsApp: 'Contact us on WhatsApp',
      sendEmail: 'Send an email',
      callUs: 'Call us'
    }
  }
}

// Traductions kinyarwanda
const rw = {
  translation: {
    common: {
      loading: 'Birimo...',
      back: 'Subira inyuma',
      optional: 'bishobotse',
      notSpecified: 'Ntabwo byuzuzwa',
      estimate: 'igereranyo',
      included: 'Bikubiye',
      description: 'Ibisobanuro',
      close: 'Funga',
      error: 'Habaye ikibazo',
      viewDetails: 'Reba ibyuzuye'
    },
    hero: {
      loveSurprise: 'Love Surprise',
      express: 'Express',
      title: 'LoveSurpriseExpress',
      subtitle: 'Dukora ibintu bitangaje bitunguranye',
      description: 'Ibyo ukenera byose by\'ibirori · Ibikoresho bya baluni · Gazi Helium · Umunyamabanga w\'ibitunguranye',
      cta: 'Tegura igitangaza cyawe',
      stats: {
        surprises: '+250 ibitangaza byateguwe',
        delivery: 'Iboneza i Kigali',
        quote: 'Igiciro ku buntu'
      }
    },
    services: {
      badge: 'Serivisi Zacu',
      title: 'Serivisi Zacu',
      subtitle: 'Ibyo ukenera byose kugira ngo ureme igihe gitangaje',
      packsTitle: 'Amapaki y\'imitako',
      includes: 'Bikubiye',
      options: 'Amahitamo',
      preparation: 'Itegurwa',
      coverage: 'Aho bigeraho',
      balloons: 'Baluni & Helium',
      decoration: 'Imitako y\'ibirori',
      planner: 'Umunyamabanga w\'ibitunguranye',
      website: 'Urubuga rwihariye',
      flowers: 'Indabyo',
      giftbasket: 'Ibikapu by\'impano',
      learnMore: 'Menya byinshi',
      requestQuote: 'Saba igiciro',
      close: 'Funga',
      buttons: {
        details: 'Ibyuzuye',
        getQuote: 'Saba igiciro'
      },
      party: {
        title: 'Imitako y\'ibirori',
        description: 'Imitako y\'ibirori ihujije n\'ibyo ukunda'
      },
      surprise: {
        title: 'Umunyamabanga w\'ibitangaza',
        description: 'Gutegura byose + guhuza nabategura'
      },
      custom: {
        title: 'Urubuga rwihariye',
        description: 'Urubuga rwihariye rw\'ibirori byawe'
      },
      flower: {
        title: 'Indabyo',
        description: 'Indabyo nziza'
      },
      gift: {
        title: 'Ibikapu by\'impano',
        description: 'Ibikapu by\'impano bihindurika'
      }
    },
    giftbaskets: {
      badge: 'Impano zihariye',
      title: 'Ibikapu By\'impano',
      subtitle: 'Impano zatoranyijwe neza kuri buri birori',
      popular: 'Ibyamamare',
      viewBasket: 'Reba ikapu',
      viewDetails: 'Ibyuzuye',
      includes: 'Ibiri mu kikapu',
      standard: 'Isanzwe',
      premium: 'Premium',
      from: 'Kuva',
      order: 'Oda',
      birthday: 'Isabukuru',
      romantic: 'Urukundo',
      newbaby: 'Uruhererekane',
      gourmet: 'Ibiryo Byiza',
      wellness: 'Ubuzima Bwiza',
      birthdayDesc: 'Ikeke nto, buji, ikarita, umutobe',
      romanticDesc: 'Chokora, buji, ibaruwa, indabyo',
      newBabyDesc: 'Imyenda, amaru, ibikoresho, ikinyonyo',
      gourmetDesc: 'Ibikome, imbuto, chokora, umutobe, ubunyobwa',
      wellnessDesc: 'Icyayi, amavuta, isabune, masque, parfum, amavuta'
    },
    gallery: {
      badge: 'Baratwizera',
      title: 'Ibitekerezo by\'Abakiriya',
      subtitle: 'Ongera ubone ibyishimo by\'abakiriya bacu nyuma y\'ibitangaza byabo',
      empty: 'Nta buhamya bukoreshwa',
      emptyCTA: 'Ube uwambere usangiza uburamya bwawe!',
      viewAll: 'Ibitekerezo by\'Abakiriya'
    },
    about: {
      ourStory: 'Inkuru yacu',
      title: 'Inyuma y\'igitangaza cyose, hari umuntu ukunda',
      description1: 'Nitwa EYEANG Love, nashinze LoveExpress. Nzahindura ibihe bisanzwe mo ibintu bitangaje.',
      description2: 'Ibyankunda buri munsi: kubona ibyishimo mu maso y\'abakira igitangaza n\'ibyishimo by\'abatanga. Buri mushinga ni umwe, buri gice kibaye ngombwa.',
      noImages: 'Ntashusho iboneka',
      qualities: {
        creativity: 'Ubuhanga butagira imbibi',
        discretion: 'Ivugwaho ritagira',
        execution: 'Gukora neza',
        details: 'Kwita ku bice'
      },
      stats: {
        satisfied: 'Abakiriya banyishimiye',
        passion: 'Urukundo n\'umurava',
        availability: 'Kuboneka',
        exclusive: 'Serivisi idasanzwe',
        surprises: 'Ibitangaza byateguwe',
        experience: 'Imyaka y\'uburambe'
      }
    },
    realizations: {
      title: 'Ibyo Dukoze',
      subtitle: 'Menya ibyo dukoze vuba',
      viewMore: 'Reba ibyo dukoze byinshi'
    },
    avisForm: {
      badge: 'Igitekerezo cyawe kirakwiriye',
      title: 'Tangira Igitekerezo Kyawe',
      subtitle: 'Sangiza ibyo wibukijwe na LoveExpress',
      rating: 'Amanota yawe',
      testimonial: 'Ubuhamya bwawe',
      name: 'Izina ryawe',
      photo: 'Ongeramo ifoto',
      photoHint: 'Kanda hano kugirango wongere ifoto',
      photoLimit: 'JPG, PNG (maxi 5MB)',
      photoLimitError: 'Ifoto ntigomba kurenga 5MB',
      messageRequired: 'Nyamuneka wandike ubuhamya bwawe',
      submitError: 'Habaye ikibazo. Ongera ugerageze.',
      submit: 'Ohereza ubuhamya bwanjye',
      footerNote: 'Igitekerezo cyawe kizashyirwaho nyuma yo kwemeza n\'itsinda ryacu',
      testimonialPlaceholder: "Nakunze igitangaza cyanjye, byose byari byiza! Urakoze LoveExpress ❤️",
      namePlaceholder: 'Marie, Jean, ...',
      success: {
        title: 'Murakoze kub ubuhamya bwawe!',
        message: 'Igitekerezo cyawe kizashyirwaho nyuma yo kwemeza n\'itsinda ryacu (mumasaha 24-48).'
      }
    },
    contactForm: {
      badge: 'Kubaza ubusa',
      title: 'Tegura Igitangaza Cyawe',
      subtitle: 'Uzuza iyi fomu twebwe turabikurebera',
      step: 'Intambwe',
      budgetHint: 'reka birushe kugira ngo ukoreshe total',
      budgetSuggestion: 'Ingengo y\'inguzanyo nkeya',
      steps: {
        0: 'Uri nde?',
        1: 'Uzakira igitangaza?',
        2: 'Iki birori?',
        3: 'Ushaka kohereza iki?',
        4: 'Iboneza & Ingengo y\'inguzanyo',
        5: 'Kwemeza'
      },
      fields: {
        fullName: 'Izina ryuzuye',
        phone: 'Nimero ya WhatsApp',
        email: 'Email',
        recipientName: 'Izina ry\'ukizakira',
        recipientPhone: 'Nimero ya telefoni',
        deliveryAddress: 'Aho koherereza',
        age: 'Imyaka',
        eventType: 'Ubwoko',
        eventDate: 'Itariki',
        eventTime: 'Isaha',
        eventLocation: 'Aho birori bizabera',
        message: 'Ubutumwa kuri karita',
        specialInstructions: 'Amabwiriza yihariye',
        deliveryMethod: 'Uburyo bwo kohereza',
        budget: 'Ingengo y\'inguzanyo',
        additionalNotes: 'Ibyo wandika byongera'
      },
      placeholders: {
        fullName: 'Izina ryawe',
        phone: '+250 7XX XXX XXX',
        email: 'example@email.com',
        recipientName: 'Izina ry\'umuntu',
        recipientPhone: '+250 7XX XXX XXX',
        deliveryAddress: 'Umuhanda, umurenge, umujyi',
        age: 'Uru: imyaka 25',
        eventLocation: 'Izina ry\'ahantu, aho biherereye',
        message: 'Isabukuru nziza! Ndagukunda',
        specialInstructions: 'Icyifuzo, amabara, ibyo ukunda...',
        additionalNotes: 'Amakuru y\'ingenzi...'
      },
      deliveryMethods: {
        delivery: 'Kohereza iwabo',
        pickup: 'Gukurura mubyiro',
        pickupFree: 'Ubuntu'
      },
      options: {
        discreet: 'Igitangaza kiracye (ntuhishurire uwohereje)',
        needsPersonPresent: 'Nyirubwite agomba kubaho mugihe cyo kohereza'
      },
      buttons: {
        next: 'Urukurikirane →',
        back: 'Subira inyuma',
        modify: 'Hindura',
        downloadPDF: 'Kurura PDF',
        confirm: 'Emeza kandi ohereza'
      },
      validation: {
        nameRequired: 'Andika izina ryawe ryuzuye',
        phoneRequired: 'Andika nimero ya WhatsApp',
        recipientNameRequired: 'Andika izina ry\'ukizakira',
        addressRequired: 'Andika aho koherereza',
        dateRequired: 'Hitamo itariki',
        timeRequired: 'Hitamo isaha',
        locationRequired: 'Andika aho birori bizabera',
        selectService: 'Hitamo serivisi, pakiti cyangwa ikapu',
        budgetRequired: 'Ingengo y\'inguzanyo nkeya:',
         invalidPhone: 'Nimero ya telefoni ntabwo ari yo. Koresha uburyo nka +2507XXXXXXXX cyangwa 07XXXXXXXX',
  emailRequired: 'Nyamuneka wandike aderesi ya email (irakenewe kugira ngo ubone icyemezo)',
  invalidEmail: 'Nyamuneka wandike aderesi ya email ifite agaciro, urugero izina@domaine.com'
      },
      review: {
        title: 'Ibyo wanditse',
        date: 'Itariki',
        clientInfo: 'Amakuru y\'umukiriya',
        recipientInfo: 'Amakuru y\'ukizakira',
        eventInfo: 'Amakuru y\'ibirori',
        services: 'Serivisi & Amapaki',
        delivery: 'Iboneza',
        total: 'Igiciro cyose'
      },
      success: {
        title: 'Ibisabwa byoherejwe!',
        message: 'Urakoze kubizerwa. Tuzagusubiza muminsa 30 kuri WhatsApp.',
        pdf: 'Ibyo wanditse bizakururwa muri PDF.'
      }
    },
    footer: {
      contact: 'Twandikire',
      services: 'Serivisi',
      hours: 'Amasaha',
      tagline: 'Dutanga urukundo n\'ubuntu. Reka dureme hamwe ibihe bitibagirana.',
      hoursDetail: 'Kuwa mbere - Kuwa gatandatu: 9h - 19h',
      sunday: 'Ku cyumweru: Ku gahunda',
      delivery247: 'Iboneza buri gihe',
      rights: 'Uburenganzira bwose burakumwe',
      developedBy: "Yakozwe na"

    },
    maintenance: {
      title: 'Furu ya gukoresha igerageza ntiboneka',
      expectedEnd: 'Igenewe gutangira',
      contactWhatsApp: 'Twandikire kuri WhatsApp',
      sendEmail: 'Ohereza email',
      callUs: 'Duhamagare'
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: fr,
      en: en,
      rw: rw
    },
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n