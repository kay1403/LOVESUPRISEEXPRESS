import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const defaultAboutImages = [
  { id: 1, src: '/images/IMG-20260417-WA0038.jpg', alt: 'EYEANG Love - Fondatrice LoveExpress', order: 1 },
  { id: 2, src: '/images/IMG-20260417-WA0039.jpg', alt: 'EYEANG Love - Organisation de surprises', order: 2 },
  { id: 3, src: '/images/IMG-20260417-WA0040.jpg', alt: 'EYEANG Love - Créatrice de moments magiques', order: 3 }
];

export async function GET() {
  try {
    const contentPath = path.join(process.cwd(), 'content', 'about_images');
    
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath);
      const images = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(contentPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const image = JSON.parse(content);
          images.push(image);
        }
      }
      
      if (images.length > 0) {
        images.sort((a, b) => (a.order || 0) - (b.order || 0));
        return NextResponse.json({ success: true, images });
      }
    }
    
    return NextResponse.json({ success: true, images: defaultAboutImages });
  } catch (error) {
    console.error('Erreur lecture about images:', error);
    return NextResponse.json({ success: true, images: defaultAboutImages });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { images } = body;
    
    if (!images || !Array.isArray(images)) {
      return NextResponse.json({ success: false, error: 'Données invalides' }, { status: 400 });
    }
    
    const contentPath = path.join(process.cwd(), 'content', 'about_images');
    if (!fs.existsSync(contentPath)) {
      fs.mkdirSync(contentPath, { recursive: true });
    }
    
    // Sauvegarder chaque image individuellement
    for (const image of images) {
      const filePath = path.join(contentPath, `image_${image.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(image, null, 2));
    }
    
    // Supprimer les anciens fichiers qui ne sont plus dans la liste
    const files = fs.readdirSync(contentPath);
    for (const file of files) {
      const fileId = parseInt(file.match(/image_(\d+)\.json/)?.[1] || '0');
      if (fileId > 0 && !images.find(i => i.id === fileId)) {
        fs.unlinkSync(path.join(contentPath, file));
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur sauvegarde about images:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}