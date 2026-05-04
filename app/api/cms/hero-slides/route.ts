import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

export async function GET() {
  try {
    const contentPath = path.join(process.cwd(), 'content', 'hero_slides');
    
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath);
      const slides = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(contentPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const slide = JSON.parse(content);
          // ✅ S'assurer que features existe
          if (!slide.features) slide.features = [];
          slides.push(slide);
        }
      }
      
      if (slides.length > 0) {
        slides.sort((a, b) => (a.order || 0) - (b.order || 0));
        return NextResponse.json({ success: true, slides });
      }
    }
    
    return NextResponse.json({ success: true, slides: defaultHeroSlides });
  } catch (error) {
    console.error('Erreur lecture hero slides:', error);
    return NextResponse.json({ success: true, slides: defaultHeroSlides });
  }
}