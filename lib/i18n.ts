import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Traductions françaises
const fr = {
  translation: {
    hero: {
      title: 'LoveExpress',
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
      title: 'Nos Services',
      subtitle: 'Tout ce dont vous avez besoin pour créer le moment de surprise parfait',
      balloons: 'Ballons & Hélium',
      decoration: 'Décoration de fête',
      planner: 'Planificateur de surprises',
      website: 'Site web personnalisé',
      flowers: 'Bouquet de fleurs',
      giftbasket: 'Paniers cadeaux',
      learnMore: 'En savoir plus',
      requestQuote: 'Demander un devis',
      close: 'Fermer'
    },
    giftbaskets: {
      title: 'Nos Paniers Cadeaux',
      subtitle: 'Des cadeaux soigneusement sélectionnés pour chaque occasion',
      birthday: 'Panier Anniversaire',
      romantic: 'Panier Romantique',
      newbaby: 'Panier Nouveau-né',
      gourmet: 'Panier Gourmet',
      wellness: 'Panier Bien-être',
      popular: 'Populaire',
      order: 'Commander',
      viewDetails: 'Voir détails',
      includes: 'Contenu du panier'
    },
    gallery: {
      title: 'Nos Réalisations',
      subtitle: 'Découvrez la magie que nous avons créée pour nos clients',
      viewAll: 'Voir toute la galerie'
    },
    about: {
      title: 'Derrière chaque surprise, une passionnée',
      description1: 'Je m\'appelle Grace Uwase, fondatrice de LoveExpress. Depuis 2020, je transforme les moments ordinaires en souvenirs extraordinaires.',
      description2: 'Ce qui me motive chaque jour : voir l\'étincelle dans les yeux de ceux qui reçoivent une surprise et la joie de ceux qui offrent. Chaque projet est unique, chaque détail compte.',
      stats: {
        surprises: 'Surprises organisées',
        experience: 'Années d\'expérience',
        satisfaction: 'Clients satisfaits',
        passion: 'Passion et dévouement'
      }
    },
    contact: {
      title: 'Planifiez Votre Surprise',
      subtitle: 'Remplissez ce formulaire et nous nous occupons de tout',
      step1: 'Qui êtes-vous ?',
      step2: 'Qui recevra la surprise ?',
      step3: 'Quel événement ?',
      step4: 'Budget',
      step5: 'Services souhaités',
      step6: 'Livraison & Instructions',
      step7: 'Confirmation'
    },
    footer: {
      tagline: 'We deliver love and kindness. Créons ensemble des moments inoubliables.',
      contact: 'Contact',
      services: 'Services',
      hours: 'Horaires',
      hoursDetail: 'Lundi - Samedi: 9h - 19h',
      sunday: 'Dimanche: Sur rendez-vous',
      delivery247: 'Livraison 24/24 sur demande',
      rights: 'Tous droits réservés'
    }
  }
}

// Traductions anglaises
const en = {
  translation: {
    hero: {
      title: 'LoveExpress',
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
      title: 'Our Services',
      subtitle: 'Everything you need to create the perfect surprise moment',
      balloons: 'Balloons & Helium',
      decoration: 'Party Decoration',
      planner: 'Surprise Planner',
      website: 'Custom Website',
      flowers: 'Flower Bouquet',
      giftbasket: 'Gift Baskets',
      learnMore: 'Learn more',
      requestQuote: 'Request a quote',
      close: 'Close'
    },
    giftbaskets: {
      title: 'Our Gift Baskets',
      subtitle: 'Carefully curated gifts for every occasion',
      birthday: 'Birthday Gift Basket',
      romantic: 'Romantic Gift Basket',
      newbaby: 'New Baby Gift Basket',
      gourmet: 'Gourmet Gift Basket',
      wellness: 'Wellness Gift Basket',
      popular: 'Popular',
      order: 'Order',
      viewDetails: 'View details',
      includes: 'Basket includes'
    },
    gallery: {
      title: 'Our Realizations',
      subtitle: 'Discover the magic we created for our clients',
      viewAll: 'View full gallery'
    },
    about: {
      title: 'Behind every surprise, a passionate person',
      description1: 'My name is Grace Uwase, founder of LoveExpress. Since 2020, I transform ordinary moments into extraordinary memories.',
      description2: 'What motivates me every day: seeing the sparkle in the eyes of those who receive a surprise and the joy of those who give. Every project is unique, every detail matters.',
      stats: {
        surprises: 'Surprises organized',
        experience: 'Years of experience',
        satisfaction: 'Happy clients',
        passion: 'Passion and dedication'
      }
    },
    contact: {
      title: 'Plan Your Surprise',
      subtitle: 'Fill out this form and we take care of everything',
      step1: 'Who are you?',
      step2: 'Who will receive the surprise?',
      step3: 'What event?',
      step4: 'Budget',
      step5: 'Services wanted',
      step6: 'Delivery & Instructions',
      step7: 'Confirmation'
    },
    footer: {
      tagline: 'We deliver love and kindness. Let\'s create unforgettable moments together.',
      contact: 'Contact',
      services: 'Services',
      hours: 'Hours',
      hoursDetail: 'Monday - Saturday: 9am - 7pm',
      sunday: 'Sunday: By appointment',
      delivery247: '24/7 delivery on request',
      rights: 'All rights reserved'
    }
  }
}

// Traductions kinyarwanda
const rw = {
  translation: {
    hero: {
      title: 'LoveExpress',
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
      title: 'Serivisi Zacu',
      subtitle: 'Ibyo ukenera byose kugira ngo ureme igihe gitangaje',
      balloons: 'Baluni & Helium',
      decoration: 'Imitako y\'ibirori',
      planner: 'Umunyamabanga w\'ibitunguranye',
      website: 'Urubuga rwihariye',
      flowers: 'Indabyo',
      giftbasket: 'Ibikapu by\'impano',
      learnMore: 'Menya byinshi',
      requestQuote: 'Saba igiciro',
      close: 'Funga'
    },
    giftbaskets: {
      title: 'Ibikapu By\'impano',
      subtitle: 'Impano zatoranyijwe neza kuri buri birori',
      birthday: 'Impano y\'Isabukuru',
      romantic: 'Impano y\'Urukundo',
      newbaby: 'Impano y\'Uruhererekane',
      gourmet: 'Impano y\'Ibiryo Byiza',
      wellness: 'Impano y\'Ubuzima Bwiza',
      popular: 'Ibyamamare',
      order: 'Oda',
      viewDetails: 'Reba ibirayi',
      includes: 'Ibiri mu kikapu'
    },
    gallery: {
      title: 'Ibyo Twakoze',
      subtitle: 'Ongera ubone ibyiza twakoze ku bakiriya bacu',
      viewAll: 'Reba byose'
    },
    about: {
      title: 'Inyuma y\'igitangaza cyose, hari umuntu ukunda',
      description1: 'Nitwa Grace Uwase, nashinze LoveExpress. Kuva 2020, ndimo nzahindura ibihe bisanzwe mo ibintu bitangaje.',
      description2: 'Ibyankunda buri munsi: kubona ibyishimo mu maso y\'abakira igitangaza n\'ibyishimo by\'abatanga. Buri mushinga ni umwe, buri gice kibaye ngombwa.',
      stats: {
        surprises: 'Ibitangaza byateguwe',
        experience: 'Imyaka y\'uburambe',
        satisfaction: 'Abakiriya banyishimiye',
        passion: 'Urukundo n\'umurava'
      }
    },
    contact: {
      title: 'Tegura Igitangaza Cyawe',
      subtitle: 'Uzuza iyi fomu twebwe turabikurebera',
      step1: 'Uri nde?',
      step2: 'Uzakira igitangaza?',
      step3: 'Iki birori?',
      step4: 'Ingengo y\'ingengo',
      step5: 'Serivisi ushaka',
      step6: 'Iboneza & Amabwiriza',
      step7: 'Kwemeza'
    },
    footer: {
      tagline: 'Dutanga urukundo n\'ubuntu. Reka dureme hamwe ibihe bitibagirana.',
      contact: 'Twandikire',
      services: 'Serivisi',
      hours: 'Amasaha',
      hoursDetail: 'Kuwa mbere - Kuwa gatandatu: 9h - 19h',
      sunday: 'Ku cyumweru: Ku gahunda',
      delivery247: 'Iboneza buri gihe',
      rights: 'Uburenganzira bwose burakumwe'
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
