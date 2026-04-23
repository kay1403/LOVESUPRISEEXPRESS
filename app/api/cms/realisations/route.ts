import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const defaultRealisations = [
  { id: 1, title: 'Demande en mariage surprise', category: 'Proposal', image: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg' },
  { id: 2, title: 'Décoration anniversaire', category: 'Birthday', image: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg' },
  { id: 3, title: 'Ballons personnalisés', category: 'Decoration', image: 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg' },
  { id: 4, title: 'Gift basket anniversaire', category: 'Gift Basket', image: 'https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg' },
  { id: 5, title: 'Teddy bear géant', category: 'Teddy Bear', image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg' },
  { id: 6, title: 'Bouquet de fleurs', category: 'Flowers', image: 'https://images.pexels.com/photos/568500/pexels-photo-568500.jpeg' }
];

export async function GET() {
  try {
    const contentPath = path.join(process.cwd(), 'content', 'realisations');
    
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath);
      const realisations = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(contentPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const realisation = JSON.parse(content);
          realisations.push(realisation);
        }
      }
      
      if (realisations.length > 0) {
        return NextResponse.json({ success: true, realisations });
      }
    }
    
    return NextResponse.json({ success: true, realisations: defaultRealisations });
  } catch (error) {
    console.error('Erreur lecture réalisations:', error);
    return NextResponse.json({ success: true, realisations: defaultRealisations });
  }
}
