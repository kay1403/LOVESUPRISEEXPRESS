// lib/cms-translations.ts

export const cmsTranslations = {
  // ==================== SERVICES ====================
  services: {
    fr: {
      party: {
        title: "Party",
        subtitle: "Decoration",
        badge: "Pack Premier Frisson",
        description: "La beauté de vos événements est préparée chaque jour", 
        longDescription: "Transformez n'importe quel espace en un lieu magique.",
        packs: [
          { name: "Pack Premier Frisson", price: 60000, desc: "15 ballons, message au sol en pétale, 5 photos suspendues, LED ou bougie" },
          { name: "Pack Love XL", price: 100000, desc: "25 ballons, lettre/chiffre lumineux, table dressée pour deux, bougie parfumée, playlist personnalisée" },
          { name: "Pack ROYAL SURPRISE", price: 200000, desc: "Rideau de ballons + néon personnalisé, plateau de fruits + vin, photographe 20 min, bouquet de fleurs" }
        ],
        includes: ["Installation complète", "Décoration sur mesure", "Démontage inclus", "Discrétion garantie"],
        duration: "4-8 heures",
        coverage: "Kigali et environs"
      },
      surprise: {
        title: "Surprise",
        subtitle: "Planner",
        badge: "Expert en émotions",
        description: "Dites nous l'occasion et on planifie toute la surprise",
        longDescription: "Vous avez l'idée, nous exécutons.",
        includes: ["Consultation et planification", "Coordination avec tous les prestataires", "Timing et discrétion garantis", "Présence sur place"],
        duration: "1-2 semaines",
        coverage: "Tout le Rwanda"
      },
      custom: {
        title: "Custom",
        subtitle: "Website",
        badge: "Digital & Créatif",
        description: "Site web personnalisé pour votre événement ou entreprise",
        longDescription: "Créez un site web personnalisé.",
        includes: ["Design personnalisé", "Hébergement 1 an inclus", "Nom de domaine personnalisé", "Support technique 3 mois"],
        duration: "5-10 jours",
        coverage: "100% en ligne"
      },
      flower: {
        title: "Flower",
        subtitle: "Bouquet",
        badge: "Frais & Élégant",
        description: "Pour tout événement - Bouquet personnalisable",
        longDescription: "Des bouquets de fleurs fraîches soigneusement sélectionnés.",
        includes: ["Fleurs fraîches de saison", "Emballage élégant", "Carte personnalisée", "Livraison offerte"],
        duration: "2 heures",
        coverage: "Kigali"
      },
      gift: {
        title: "Gift",
        subtitle: "Baskets",
        badge: "Luxe & Douceur",
        description: "Paniers cadeaux personnalisables pour toutes les occasions",
        longDescription: "Des paniers cadeaux luxueux soigneusement composés.",
        includes: ["Panier premium", "Produits de qualité", "Carte personnalisée", "Emballage cadeau"],
        duration: "1-2 jours",
        coverage: "Tout le Rwanda"
      }
    },
    en: {
      party: {
        title: "Party",
        subtitle: "Decoration",
        badge: "Premier Thrill Pack",
        description: "The beauty of your events is prepared everyday",
        longDescription: "Transform any space into a magical place.",
        packs: [
          { name: "Premier Thrill Pack", price: 60000, desc: "15 balloons, petal floor message, 5 suspended photos, LED or candle" },
          { name: "Love XL Pack", price: 100000, desc: "25 balloons, light up letter/number, table set for two, scented candle, personalized playlist" },
          { name: "ROYAL SURPRISE Pack", price: 200000, desc: "Balloon curtain + custom neon, fruit platter + wine, 20min photographer, flower bouquet" }
        ],
        includes: ["Full installation", "Custom decoration", "Removal included", "Guaranteed discretion"],
        duration: "4-8 hours",
        coverage: "Kigali and surroundings"
      },
      surprise: {
        title: "Surprise",
        subtitle: "Planner",
        badge: "Emotion Expert",
        description: "Tell us the occasion and we plan the whole surprise",
        longDescription: "You have the idea, we execute.",
        includes: ["Consultation & planning", "Coordination with all providers", "Timing & discretion guaranteed", "On-site presence"],
        duration: "1-2 weeks",
        coverage: "All Rwanda"
      },
      custom: {
        title: "Custom",
        subtitle: "Website",
        badge: "Digital & Creative",
        description: "Custom website for your event or business",
        longDescription: "Create a custom website.",
        includes: ["Custom design", "1 year hosting included", "Custom domain name", "3 months technical support"],
        duration: "5-10 days",
        coverage: "100% online"
      },
      flower: {
        title: "Flower",
        subtitle: "Bouquet",
        badge: "Fresh & Elegant",
        description: "For any event - Customizable bouquet",
        longDescription: "Fresh flowers carefully selected.",
        includes: ["Seasonal fresh flowers", "Elegant packaging", "Personalized card", "Free delivery"],
        duration: "2 hours",
        coverage: "Kigali"
      },
      gift: {
        title: "Gift",
        subtitle: "Baskets",
        badge: "Luxury & Sweetness",
        description: "Customizable gift baskets for all occasions",
        longDescription: "Luxury gift baskets carefully composed.",
        includes: ["Premium basket", "Quality products", "Personalized card", "Gift wrapping"],
        duration: "1-2 days",
        coverage: "All Rwanda"
      }
    },
    rw: {
      party: {
        title: "Party",
        subtitle: "Decoration",
        badge: "Iseguriro rya mbere",
        description: "Ubwiza bw'ibirori byawe butegurwa buri munsi", // ✅ KINYARWANDA
        longDescription: "Hindura ahantu hose haba ahantu h'ubwiza.",
        packs: [
          { name: "Iseguriro rya mbere", price: 60000, desc: "Ibipuuho 15, ubutumwa bw'indabyo hasi, amafoto 5, LED cyangwa buji" },
          { name: "Love XL", price: 100000, desc: "Ibipuuho 25, inyuguti yaka, imesha yateguriwe kabiri, buji y'impumuro nziza, urutonde rw'indirimbo" },
          { name: "ROYAL SURPRISE", price: 200000, desc: "Umupira w'ibipuuho + neon ryihariye, isahani y'imbuto + divayi, amafoto 20min, indabyo" }
        ],
        includes: ["Gushyiraho byose", "Umutako uhujije", "Gukuramo bikubiye", "Ibyihishwe byizewe"],
        duration: "amasaha 4-8",
        coverage: "Kigali n'uturere"
      },
      surprise: {
        title: "Surprise",
        subtitle: "Planner",
        badge: "Umunyamabanga w'ibitangaza",
        description: "Tubwire ibirori tukabitegurira byose",
        longDescription: "Ufite igitekerezo, turakora.",
        includes: ["Kuganira no gutegura", "Guhuza nabategura bose", "Igihe n'ibyihishwe byizewe", "Kuba hari"],
        duration: "Ibyumweru 1-2",
        coverage: "U Rwanda rwose"
      },
      custom: {
        title: "Custom",
        subtitle: "Website",
        badge: "Digital & Ubuhanga",
        description: "Urubuga rwihariye rw'ibirori byawe cyangwa ubucuruzi",
        longDescription: "Kora urubuga rwihariye.",
        includes: ["Ishusho yihariye", "Kubika urubuga umwaka 1", "Izina ry'urubuga", "Ubufasha bumezi 3"],
        duration: "Iminsi 5-10",
        coverage: "100% kumurongo"
      },
      flower: {
        title: "Flower",
        subtitle: "Bouquet",
        badge: "Nziza & Iza",
        description: "Kubirori byose - Indabyo zihindurika",
        longDescription: "Indabyo nziza zatoranyijwe neza.",
        includes: ["Indabyo nziza", "Icyuzuzo cyiza", "Ikarita yihariye", "Kohereza ubusa"],
        duration: "Amasaha 2",
        coverage: "Kigali"
      },
      gift: {
        title: "Gift",
        subtitle: "Baskets",
        badge: "Agaciro & Ubugonde",
        description: "Ibikapu by'impano bihindurika kubirori byose",
        longDescription: "Ibikapu by'impano by'agaciro byateguriwe neza.",
        includes: ["Ikipu cy'agaciro", "Ibicuruzwa byiza", "Ikarita yihariye", "Icyuzuzo cy'impano"],
        duration: "Iminsi 1-2",
        coverage: "U Rwanda rwose"
      }
    }
  },

  // ==================== GIFT BASKETS ====================
  giftBaskets: {
    fr: [
      { name: "Birthday", subtitle: "Gift Basket", badge: "Anniversaire", description: "Pour un anniversaire inoubliable", longDescription: "Mini gâteau d'anniversaire, bougie, carte personnalisée, jus de fruit.", includes: ["Mini gâteau anniversaire", "Bougie", "Carte personnalisée", "Jus de fruit"] },
      { name: "Romantic", subtitle: "Gift Basket", badge: "Romantique", description: "Pour votre moitié", longDescription: "Chocolat, bougies parfumées, lettre d'amour, bouquet de fleurs.", includes: ["Chocolat", "Bougies parfumées", "Lettre d'amour", "Bouquet de fleurs"] },
      { name: "New Baby", subtitle: "Gift Basket", badge: "Naissance", description: "Bienvenue au nouveau-né", longDescription: "Vêtements bébé, couches, produits de soin, doudou.", includes: ["Vêtements bébé", "Couches", "Produits de soin", "Doudou"] },
      { name: "Gourmet", subtitle: "Gift Basket", badge: "Gastronomie", description: "Pour les gourmands", longDescription: "Biscuits, fruits, chocolat, jus, bonbons.", includes: ["Biscuits", "Fruits", "Chocolat", "Jus", "Bonbons"] },
      { name: "Wellness", subtitle: "Gift Basket", badge: "Bien-être", description: "Détente et bien-être", longDescription: "Thé, huiles essentielles, savon, masques visage, parfum, crème.", includes: ["Thé", "Huiles essentielles", "Savon", "Masques visage", "Parfum", "Crème"] }
    ],
    en: [
      { name: "Birthday", subtitle: "Gift Basket", badge: "Birthday", description: "For an unforgettable birthday", longDescription: "Mini birthday cake, candle, personalized card, fruit juice.", includes: ["Mini birthday cake", "Candle", "Personalized card", "Fruit juice"] },
      { name: "Romantic", subtitle: "Gift Basket", badge: "Romantic", description: "For your significant other", longDescription: "Chocolate, scented candles, love letter, flower bouquet.", includes: ["Chocolate", "Scented candles", "Love letter", "Flower bouquet"] },
      { name: "New Baby", subtitle: "Gift Basket", badge: "New Baby", description: "Welcome to the newborn", longDescription: "Baby clothes, diapers, care products, soft toy.", includes: ["Baby clothes", "Diapers", "Care products", "Soft toy"] },
      { name: "Gourmet", subtitle: "Gift Basket", badge: "Gourmet", description: "For food lovers", longDescription: "Cookies, fruits, chocolate, juice, candies.", includes: ["Cookies", "Fruits", "Chocolate", "Juice", "Candies"] },
      { name: "Wellness", subtitle: "Gift Basket", badge: "Wellness", description: "Relaxation & well-being", longDescription: "Tea, essential oils, soap, face masks, perfume, cream.", includes: ["Tea", "Essential oils", "Soap", "Face masks", "Perfume", "Cream"] }
    ],
    rw: [
      { name: "Birthday", subtitle: "Gift Basket", badge: "Isabukuru", description: "Kuby umunsi mukuru utibagirana", longDescription: "Ikeke nto y'isabukuru, buji, ikarita yihariye, umutobe w'imbuto.", includes: ["Ikeke nto y'isabukuru", "Buji", "Ikarita yihariye", "Umutobe w'imbuto"] },
      { name: "Romantic", subtitle: "Gift Basket", badge: "Urukundo", description: "Kuby uwukunda", longDescription: "Chokora, buji z'impumuro nziza, ibaruwa y'urukundo, indabyo.", includes: ["Chokora", "Buji z'impumuro nziza", "Ibaruwa y'urukundo", "Indabyo"] },
      { name: "New Baby", subtitle: "Gift Basket", badge: "Uruhererekane", description: "Murakaza neza kumwana mushya", longDescription: "Imyenda y'umwana, amaru, ibikoresho byo kwitaho, ikinyonyo.", includes: ["Imyenda y'umwana", "Amaru", "Ibikoresho byo kwitaho", "Ikinyonyo"] },
      { name: "Gourmet", subtitle: "Gift Basket", badge: "Ibiryo Byiza", description: "Kuby abakunda ibiryo", longDescription: "Ibikome, imbuto, chokora, umutobe, ubunyobwa.", includes: ["Ibikome", "Imbuto", "Chokora", "Umutobe", "Ubunyobwa"] },
      { name: "Wellness", subtitle: "Gift Basket", badge: "Ubuzima Bwiza", description: "Ukaruhukire n'ubuzima bwiza", longDescription: "Icyayi, amavuta y'impumuro nziza, isabune, ibishushanyo mu maso, parfum, amavuta.", includes: ["Icyayi", "Amavuta y'impumuro nziza", "Isabune", "Ibishushanyo mu maso", "Parfum", "Amavuta"] }
    ]
  },

  // ==================== HERO SLIDES ====================
  heroSlides: {
    fr: [
      { title: "Bouquet", subtitle: "de Fleurs", badge: "Frais & Élégant", description: "Des bouquets de fleurs fraîches pour toutes les occasions.", features: ["Fleurs fraîches de saison", "Emballage élégant", "Carte personnalisée", "Livraison offerte"] },
      { title: "Décoration", subtitle: "d'Exception", badge: "Art & Élégance", description: "Transformez n'importe quel espace en un lieu magique.", features: ["Décoration sur mesure", "Installation complète", "Démontage inclus", "Discrétion garantie"] },
      { title: "Surprise", subtitle: "Planner", badge: "Expert en émotions", description: "Vous avez l'idée, nous l'exécutons.", features: ["Planification complète", "Coordination avec prestataires", "Timing et discrétion", "Présence sur place"] },
      { title: "Gift", subtitle: "Baskets", badge: "Luxe & Douceur", description: "Des paniers cadeaux luxueux soigneusement composés.", features: ["Panier premium", "Produits de qualité", "Carte personnalisée", "Emballage cadeau"] }
    ],
    en: [
      { title: "Bouquet", subtitle: "of Flowers", badge: "Fresh & Elegant", description: "Fresh flower bouquets for all occasions.", features: ["Seasonal fresh flowers", "Elegant packaging", "Personalized card", "Free delivery"] },
      { title: "Decoration", subtitle: "Exceptional", badge: "Art & Elegance", description: "Transform any space into a magical place.", features: ["Custom decoration", "Full installation", "Removal included", "Guaranteed discretion"] },
      { title: "Surprise", subtitle: "Planner", badge: "Emotion Expert", description: "You have the idea, we execute it.", features: ["Complete planning", "Provider coordination", "Timing & discretion", "On-site presence"] },
      { title: "Gift", subtitle: "Baskets", badge: "Luxury & Sweetness", description: "Luxury gift baskets carefully crafted.", features: ["Premium basket", "Quality products", "Personalized card", "Gift wrapping"] }
    ],
    rw: [
      { title: "Indabyo", subtitle: "Nziza", badge: "Nziza & Iza", description: "Indabyo nziza zitoranyijwe kubirori byose.", features: ["Indabyo nziza", "Icyuzuzo cyiza", "Ikarita yihariye", "Kohereza ubusa"] },
      { title: "Umutako", subtitle: "Udasanze", badge: "Ubuhanzi & Ubwiza", description: "Hindura ahantu hose haba ahantu h'ubwiza.", features: ["Umutako uhujije", "Gushyiraho byose", "Gukuramo bikubiye", "Ibyihishwe byizewe"] },
      { title: "Igitangaza", subtitle: "Planner", badge: "Umunyamabanga w'ibitangaza", description: "Ufite igitekerezo, turakora.", features: ["Gutegura byose", "Guhuza nabategura", "Igihe n'ibyihishwe", "Kuba hari"] },
      { title: "Impano", subtitle: "Mumakapu", badge: "Agaciro & Ubugonde", description: "Ibikapu by'impano by'agaciro byateguriwe neza.", features: ["Ikipu cy'agaciro", "Ibicuruzwa byiza", "Ikarita yihariye", "Icyuzuzo cy'impano"] }
    ]
  },

  // ==================== REALISATIONS ====================
  realisations: {
    fr: [
      "Demande en mariage surprise",
      "Décoration anniversaire",
      "Ballons personnalisés",
      "Gift basket anniversaire",
      "Teddy bear géant",
      "Bouquet de fleurs"
    ],
    en: [
      "Surprise marriage proposal",
      "Birthday decoration",
      "Custom balloons",
      "Birthday gift basket",
      "Giant teddy bear",
      "Flower bouquet"
    ],
    rw: [
      "Gusaba mu rugo bitunguranye",
      "Umutako w'isabukuru",
      "Ibipuuho bihujije",
      "Ikipu cy'impano cy'isabukuru",
      "Teddy bear nini",
      "Indabyo"
    ]
  },

  // ==================== FOOTER ====================
  footer: {
    fr: {
      slogan: "We deliver love and kindness. Créons ensemble des moments inoubliables.",
      hours: [
        { day: "Lundi - Samedi", time: "9h - 19h" },
        { day: "Dimanche", time: "Sur rendez-vous" },
        { day: "Livraison 24/24", time: "Sur demande" }
      ],
      copyright: "Tous droits réservés"
    },
    en: {
      slogan: "We deliver love and kindness. Let's create unforgettable moments together.",
      hours: [
        { day: "Monday - Saturday", time: "9am - 7pm" },
        { day: "Sunday", time: "By appointment" },
        { day: "24/7 Delivery", time: "On request" }
      ],
      copyright: "All rights reserved"
    },
    rw: {
      slogan: "Dutanga urukundo n'ubuntu. Reka dureme hamwe ibihe bitibagirana.",
      hours: [
        { day: "Kuwa mbere - Kuwa gatandatu", time: "9h - 19h" },
        { day: "Ku cyumweru", time: "Biteganyijwe" },
        { day: "Iboneza buri gihe", time: "Ubisaba" }
      ],
      copyright: "Uburenganzira bwose burakumwe"
    }
  }
};

// Fonction pour appliquer la traduction à un service
export function translateService(service: any, lang: string, index: number): any {
  const translations = cmsTranslations.services[lang as keyof typeof cmsTranslations.services];
  if (!translations || lang === 'fr') return service;
  
  const keys = ['party', 'surprise', 'custom', 'flower', 'gift'];
  const key = keys[index] || keys[service.id - 1] || 'party';
  const t = translations[key as keyof typeof translations];
  
  if (!t) return service;
  
  return {
    ...service,
    title: t.title,
    subtitle: t.subtitle,
    badge: t.badge,
    description: t.description,
    longDescription: t.longDescription,
    includes: t.includes,
    duration: t.duration,
    coverage: t.coverage,
    packs: ('packs' in t ? t.packs : service.packs)
  };
}

// Fonction pour appliquer la traduction à un panier cadeau
export function translateGiftBasket(basket: any, lang: string, index: number): any {
  const translations = cmsTranslations.giftBaskets[lang as keyof typeof cmsTranslations.giftBaskets];
  if (!translations || lang === 'fr') return basket;
  
  const t = translations[index];
  if (!t) return basket;
  
  return {
    ...basket,
    name: t.name,
    badge: t.badge,
    description: t.description,
    longDescription: t.longDescription,
    includes: t.includes
  };
}

// Fonction pour appliquer la traduction à un slide hero
export function translateHeroSlide(slide: any, lang: string, index: number): any {
  const translations = cmsTranslations.heroSlides[lang as keyof typeof cmsTranslations.heroSlides];
  if (!translations || lang === 'fr') return slide;
  
  const t = translations[index];
  if (!t) return slide;
  
  return {
    ...slide,
    title: t.title,
    subtitle: t.subtitle,
    badge: t.badge,
    description: t.description,
    features: t.features
  };
}