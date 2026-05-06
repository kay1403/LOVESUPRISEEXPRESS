// lib/cms-fallback.ts
export const CMS_FALLBACKS = {
  footer: {
    companyName: "LoveExpress",
    slogan: "We deliver love and kindness. Créons ensemble des moments inoubliables.",
    phone1: "+250 799 366 007",
    phone2: "+250 737 769 092",
    address: "Kigali, Rwanda",
    hours: [
      { day: "Lundi - Samedi", time: "9h - 19h" },
      { day: "Dimanche", time: "Sur rendez-vous" },
      { day: "Livraison 24/24", time: "Sur demande" }
    ],
    services: ["Party Decoration", "Surprise Planner", "Flower Bouquet", "Gift Baskets"],
    copyright: "Tous droits réservés",
    year: new Date().getFullYear()
  },
  
  services: [
    { id: 1, title: "Party", subtitle: "Decoration", badge: "Pack Premier Frisson", description: "The beauty of your events is prepared everyday", longDescription: "Transformez n'importe quel espace en un lieu magique.", basePrice: 60000, priceRange: "60 000 RWF", image: "https://images.pexels.com/photos/11474201/pexels-photo-11474201.jpeg", packs: [{ name: "Pack Premier Frisson", price: 60000, desc: "15 ballons, message au sol en pétale, 5 photos suspendues, LED ou bougie" }, { name: "Pack Love XL", price: 100000, desc: "25 ballons, lettre/chiffre lumineux, table dressée pour deux, bougie parfumée, playlist personnalisée" }, { name: "Pack ROYAL SURPRISE", price: 200000, desc: "Rideau de ballons + néon personnalisé, plateau de fruits + vin, photographe 20 min, bouquet de fleurs" }], includes: ["Installation complète", "Décoration sur mesure", "Démontage inclus", "Discrétion garantie"], duration: "4-8 heures", coverage: "Kigali et environs" },
    { id: 2, title: "Surprise", subtitle: "Planner", badge: "Expert en émotions", description: "Dites nous l'occasion et on planifie toute la surprise", longDescription: "Vous avez l'idée, nous exécutons.", basePrice: 200000, priceRange: "200 000 RWF", image: "https://i.pinimg.com/1200x/44/8c/f2/448cf2102dc4b6f9156ed867f181e985.jpg", includes: ["Consultation et planification", "Coordination avec tous les prestataires", "Timing et discrétion garantis", "Présence sur place"], duration: "1-2 semaines", coverage: "Tout le Rwanda" },
    { id: 3, title: "Custom", subtitle: "Website", badge: "Digital & Créatif", description: "Site web personnalisé pour votre événement ou entreprise", longDescription: "Créez un site web personnalisé.", basePrice: 25000, priceRange: "25 000 - 45 000 RWF", image: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg", includes: ["Design personnalisé", "Hébergement 1 an inclus", "Nom de domaine personnalisé", "Support technique 3 mois"], duration: "5-10 jours", coverage: "100% en ligne" },
    { id: 4, title: "Flower", subtitle: "Bouquet", badge: "Frais & Élégant", description: "Pour tout événement - Bouquet personnalisable", longDescription: "Des bouquets de fleurs fraîches soigneusement sélectionnés.", basePrice: 15000, priceRange: "15 000 RWF", image: "https://images.pexels.com/photos/32356065/pexels-photo-32356065.jpeg", includes: ["Fleurs fraîches de saison", "Emballage élégant", "Carte personnalisée", "Livraison offerte"], duration: "2 heures", coverage: "Kigali" },
    { id: 5, title: "Gift", subtitle: "Baskets", badge: "Luxe & Douceur", description: "Paniers cadeaux personnalisables pour toutes les occasions", longDescription: "Des paniers cadeaux luxueux soigneusement composés.", basePrice: 15000, priceRange: "15 000 - 100 000 RWF", image: "https://i.pinimg.com/1200x/ba/98/c8/ba98c85a1a0864781b15f9f0a823a691.jpg", includes: ["Panier premium", "Produits de qualité", "Carte personnalisée", "Emballage cadeau"], duration: "1-2 jours", coverage: "Tout le Rwanda" }
  ],
  
  giftBaskets: [
    { id: 1, name: 'Birthday', subtitle: 'Gift Basket', badge: 'Anniversaire', description: 'Pour un anniversaire inoubliable', longDescription: 'Mini gâteau d\'anniversaire, bougie, carte personnalisée, jus de fruit.', priceStandard: 15000, pricePremium: 80000, popular: true, image: 'https://i.pinimg.com/1200x/ec/36/e4/ec36e470b8d41448d810491847893f83.jpg', includes: ['Mini gâteau anniversaire', 'Bougie', 'Carte personnalisée', 'Jus de fruit'] },
    { id: 2, name: 'Romantic', subtitle: 'Gift Basket', badge: 'Romantique', description: 'Pour votre moitié', longDescription: 'Chocolat, bougies parfumées, lettre d\'amour, bouquet de fleurs.', priceStandard: 40000, pricePremium: 50000, popular: true, image: 'https://i.pinimg.com/736x/63/a7/09/63a709e557275506ec67b31b59642c44.jpg', includes: ['Chocolat', 'Bougies parfumées', 'Lettre d\'amour', 'Bouquet de fleurs'] },
    { id: 3, name: 'New Baby', subtitle: 'Gift Basket', badge: 'Naissance', description: 'Bienvenue au nouveau-né', longDescription: 'Vêtements bébé, couches, produits de soin, doudou.', priceStandard: 40000, pricePremium: 80000, popular: false, image: 'https://i.pinimg.com/1200x/48/b0/79/48b07903362683f89724cc49e705a008.jpg', includes: ['Vêtements bébé', 'Couches', 'Produits de soin', 'Doudou'] },
    { id: 4, name: 'Gourmet', subtitle: 'Gift Basket', badge: 'Gastronomie', description: 'Pour les gourmands', longDescription: 'Biscuits, fruits, chocolat, jus, bonbons.', priceStandard: 20000, pricePremium: 70000, popular: true, image: 'https://i.pinimg.com/1200x/5d/1c/43/5d1c43fa44d4ceec1d095ce415241b0a.jpg', includes: ['Biscuits', 'Fruits', 'Chocolat', 'Jus', 'Bonbons'] },
    { id: 5, name: 'Wellness', subtitle: 'Gift Basket', badge: 'Bien-être', description: 'Détente et bien-être', longDescription: 'Thé, huiles essentielles, savon, masques visage, parfum, crème.', priceStandard: 50000, pricePremium: 100000, popular: false, image: 'https://i.pinimg.com/1200x/fe/c3/97/fec397b6fbc634e851457411b107e4c5.jpg', includes: ['Thé', 'Huiles essentielles', 'Savon', 'Masques visage', 'Parfum', 'Crème'] }
  ],
  
  heroSlides: [
    { id: 1, title: "Bouquet", subtitle: "de Fleurs", badge: "Frais & Élégant", description: "Des bouquets de fleurs fraîches pour toutes les occasions.", image: "https://images.pexels.com/photos/35841488/pexels-photo-35841488.jpeg", features: ["Fleurs fraîches de saison", "Emballage élégant", "Carte personnalisée", "Livraison offerte"], order: 1, bgColor: "#FF4D6D", bgLight: "#FFF0F3" },
    { id: 2, title: "Décoration", subtitle: "d'Exception", badge: "Art & Élégance", description: "Transformez n'importe quel espace en un lieu magique.", image: "https://images.pexels.com/photos/17417854/pexels-photo-17417854.jpeg", features: ["Décoration sur mesure", "Installation complète", "Démontage inclus", "Discrétion garantie"], order: 2, bgColor: "#FF4D6D", bgLight: "#FFF0F3" },
    { id: 3, title: "Surprise", subtitle: "Planner", badge: "Expert en émotions", description: "Vous avez l'idée, nous l'exécutons.", image: "https://images.pexels.com/photos/30319620/pexels-photo-30319620.jpeg", features: ["Planification complète", "Coordination avec prestataires", "Timing et discrétion", "Présence sur place"], order: 3, bgColor: "#FF4D6D", bgLight: "#FFF0F3" },
    { id: 4, title: "Gift", subtitle: "Baskets", badge: "Luxe & Douceur", description: "Des paniers cadeaux luxueux soigneusement composés.", image: "https://i.pinimg.com/1200x/e6/3e/d3/e63ed35a4e166f7830f1ef5cd2839392.jpg", features: ["Panier premium", "Produits de qualité", "Carte personnalisée", "Emballage cadeau"], order: 4, bgColor: "#FF4D6D", bgLight: "#FFF0F3" }
  ],
  
  realisations: [
    { id: 1, title: 'Demande en mariage surprise', category: 'Proposal', mediaType: 'image', image: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg' },
    { id: 2, title: 'Décoration anniversaire', category: 'Birthday', mediaType: 'image', image: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg' },
    { id: 3, title: 'Ballons personnalisés', category: 'Decoration', mediaType: 'image', image: 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg' },
    { id: 4, title: 'Gift basket anniversaire', category: 'Gift Basket', mediaType: 'image', image: 'https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg' },
    { id: 5, title: 'Teddy bear géant', category: 'Teddy Bear', mediaType: 'image', image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg' },
    { id: 6, title: 'Bouquet de fleurs', category: 'Flowers', mediaType: 'image', image: 'https://images.pexels.com/photos/568500/pexels-photo-568500.jpeg' }
  ],
  
  aboutImages: [
    { id: 1, src: '/images/IMG-20260417-WA0038.jpg', alt: 'EYEANG Love - Fondatrice LoveExpress', order: 1 },
    { id: 2, src: '/images/IMG-20260417-WA0039.jpg', alt: 'EYEANG Love - Organisation de surprises', order: 2 },
    { id: 3, src: '/images/IMG-20260417-WA0040.jpg', alt: 'EYEANG Love - Créatrice de moments magiques', order: 3 }
  ]
};