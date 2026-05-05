import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { translateHeroSlide } from '@/lib/cms-translations';

const defaultHeroSlides = [
  {
    id: 1,
    title: "Bouquet",
    subtitle: "de Fleurs",
    badge: "Frais & Élégant",
    description: "Des bouquets de fleurs fraîches pour toutes les occasions.",
    image: "https://images.pexels.com/photos/35841488/pexels-photo-35841488.jpeg",
    features: ["Fleurs fraîches de saison", "Emballage élégant", "Carte personnalisée", "Livraison offerte"],
    order: 1,
    bgColor: "#FF4D6D",
    bgLight: "#FFF0F3"
  },
  {
    id: 2,
    title: "Décoration",
    subtitle: "d'Exception",
    badge: "Art & Élégance",
    description: "Transformez n'importe quel espace en un lieu magique.",
    image: "https://images.pexels.com/photos/17417854/pexels-photo-17417854.jpeg",
    features: ["Décoration sur mesure", "Installation complète", "Démontage inclus", "Discrétion garantie"],
    order: 2,
    bgColor: "#FF4D6D",
    bgLight: "#FFF0F3"
  },
  {
    id: 3,
    title: "Surprise",
    subtitle: "Planner",
    badge: "Expert en émotions",
    description: "Vous avez l'idée, nous l'exécutons.",
    image: "https://images.pexels.com/photos/30319620/pexels-photo-30319620.jpeg",
    features: ["Planification complète", "Coordination avec prestataires", "Timing et discrétion", "Présence sur place"],
    order: 3,
    bgColor: "#FF4D6D",
    bgLight: "#FFF0F3"
  },
  {
    id: 4,
    title: "Gift",
    subtitle: "Baskets",
    badge: "Luxe & Douceur",
    description: "Des paniers cadeaux luxueux soigneusement composés.",
    image: "https://i.pinimg.com/1200x/e6/3e/d3/e63ed35a4e166f7830f1ef5cd2839392.jpg",
    features: ["Panier premium", "Produits de qualité", "Carte personnalisée", "Emballage cadeau"],
    order: 4,
    bgColor: "#FF4D6D",
    bgLight: "#FFF0F3"
  }
];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'fr';
    
    const contentPath = path.join(process.cwd(), 'content', 'hero_slides');
    let slides = [];
    
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(contentPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const slide = JSON.parse(content);
          if (!slide.features) slide.features = [];
          slides.push(slide);
        }
      }
    }
    
    // Si aucun fichier trouvé, utiliser les données par défaut
    if (slides.length === 0) {
      slides = [...defaultHeroSlides];
    }
    
    slides.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // ✅ TOUJOURS appliquer la traduction si la langue n'est pas française
    if (lang !== 'fr') {
      const translatedSlides = slides.map((slide, idx) => translateHeroSlide(slide, lang, idx));
      return NextResponse.json({ success: true, slides: translatedSlides });
    }
    
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    console.error('Erreur lecture hero slides:', error);
    const lang = new URL(request.url).searchParams.get('lang') || 'fr';
    let defaultData = [...defaultHeroSlides];
    if (lang !== 'fr') {
      defaultData = defaultData.map((slide, idx) => translateHeroSlide(slide, lang, idx));
    }
    return NextResponse.json({ success: true, slides: defaultData });
  }
}