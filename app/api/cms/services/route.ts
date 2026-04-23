import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Données par défaut (fallback si fichiers CMS non trouvés)
const defaultServices = [
  {
    id: 1,
    title: "Party",
    subtitle: "Decoration",
    badge: "Pack Premier Frisson",
    description: "The beauty of your events is prepared everyday",
    longDescription: "Transformez n'importe quel espace en un lieu magique.",
    basePrice: 60000,
    priceRange: "60 000 RWF",
    image: "https://images.pexels.com/photos/11474201/pexels-photo-11474201.jpeg",
    packs: [
      { name: "Pack Premier Frisson", price: 60000, desc: "15 ballons, message au sol en pétale, 5 photos suspendues, LED ou bougie" },
      { name: "Pack Love XL", price: 100000, desc: "25 ballons, lettre/chiffre lumineux, table dressée pour deux, bougie parfumée, playlist personnalisée" },
      { name: "Pack ROYAL SURPRISE", price: 200000, desc: "Rideau de ballons + néon personnalisé, plateau de fruits + vin, photographe 20 min, bouquet de fleurs" }
    ],
    includes: ["Installation complète", "Décoration sur mesure", "Démontage inclus", "Discrétion garantie"],
    duration: "4-8 heures",
    coverage: "Kigali et environs"
  },
  {
    id: 2,
    title: "Surprise",
    subtitle: "Planner",
    badge: "Expert en émotions",
    description: "Dites nous l'occasion et on planifie toute la surprise",
    longDescription: "Vous avez l'idée, nous exécutons.",
    basePrice: 200000,
    priceRange: "200 000 RWF",
    image: "https://i.pinimg.com/1200x/44/8c/f2/448cf2102dc4b6f9156ed867f181e985.jpg",
    includes: ["Consultation et planification", "Coordination avec tous les prestataires", "Timing et discrétion garantis", "Présence sur place"],
    duration: "1-2 semaines",
    coverage: "Tout le Rwanda"
  },
  {
    id: 3,
    title: "Custom",
    subtitle: "Website",
    badge: "Digital & Créatif",
    description: "Site web personnalisé pour votre événement ou entreprise",
    longDescription: "Créez un site web personnalisé.",
    basePrice: 25000,
    priceRange: "25 000 - 45 000 RWF",
    image: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg",
    includes: ["Design personnalisé", "Hébergement 1 an inclus", "Nom de domaine personnalisé", "Support technique 3 mois"],
    duration: "5-10 jours",
    coverage: "100% en ligne"
  },
  {
    id: 4,
    title: "Flower",
    subtitle: "Bouquet",
    badge: "Frais & Élégant",
    description: "Pour tout événement - Bouquet personnalisable",
    longDescription: "Des bouquets de fleurs fraîches soigneusement sélectionnés.",
    basePrice: 15000,
    priceRange: "15 000 RWF",
    image: "https://images.pexels.com/photos/32356065/pexels-photo-32356065.jpeg",
    includes: ["Fleurs fraîches de saison", "Emballage élégant", "Carte personnalisée", "Livraison offerte"],
    duration: "2 heures",
    coverage: "Kigali"
  },
  {
    id: 5,
    title: "Gift",
    subtitle: "Baskets",
    badge: "Luxe & Douceur",
    description: "Paniers cadeaux personnalisables pour toutes les occasions",
    longDescription: "Des paniers cadeaux luxueux soigneusement composés.",
    basePrice: 15000,
    priceRange: "15 000 - 100 000 RWF",
    image: "https://i.pinimg.com/1200x/ba/98/c8/ba98c85a1a0864781b15f9f0a823a691.jpg",
    includes: ["Panier premium", "Produits de qualité", "Carte personnalisée", "Emballage cadeau"],
    duration: "1-2 jours",
    coverage: "Tout le Rwanda"
  }
];

export async function GET() {
  try {
    // Essayer de lire les fichiers CMS
    const contentPath = path.join(process.cwd(), 'content', 'services');
    
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath);
      const services = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(contentPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const service = JSON.parse(content);
          services.push(service);
        }
      }
      
      if (services.length > 0) {
        return NextResponse.json({ success: true, services });
      }
    }
    
    // Fallback aux données par défaut
    return NextResponse.json({ success: true, services: defaultServices });
  } catch (error) {
    console.error('Erreur lecture services:', error);
    return NextResponse.json({ success: true, services: defaultServices });
  }
}
