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
    order: 1
  },
  {
    id: 2,
    title: "Décoration",
    subtitle: "d'Exception",
    badge: "Art & Élégance",
    description: "Transformez n'importe quel espace en un lieu magique.",
    image: "https://images.pexels.com/photos/17417854/pexels-photo-17417854.jpeg",
    order: 2
  },
  {
    id: 3,
    title: "Surprise",
    subtitle: "Planner",
    badge: "Expert en émotions",
    description: "Vous avez l'idée, nous l'exécutons.",
    image: "https://images.pexels.com/photos/30319620/pexels-photo-30319620.jpeg",
    order: 3
  },
  {
    id: 4,
    title: "Gift",
    subtitle: "Baskets",
    badge: "Luxe & Douceur",
    description: "Des paniers cadeaux luxueux soigneusement composés.",
    image: "https://i.pinimg.com/1200x/e6/3e/d3/e63ed35a4e166f7830f1ef5cd2839392.jpg",
    order: 4
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
