// app/api/cms/realisations/route.ts (version mise à jour)
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cmsTranslations } from '@/lib/cms-translations';

const defaultRealisations = [
  { id: 1, title: 'Demande en mariage surprise', category: 'Proposal', mediaType: 'image', image: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg' },
  { id: 2, title: 'Décoration anniversaire', category: 'Birthday', mediaType: 'image', image: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg' },
  { id: 3, title: 'Ballons personnalisés', category: 'Decoration', mediaType: 'image', image: 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg' },
  { id: 4, title: 'Gift basket anniversaire', category: 'Gift Basket', mediaType: 'image', image: 'https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg' },
  { id: 5, title: 'Teddy bear géant', category: 'Teddy Bear', mediaType: 'image', image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg' },
  { id: 6, title: 'Bouquet de fleurs', category: 'Flowers', mediaType: 'image', image: 'https://images.pexels.com/photos/568500/pexels-photo-568500.jpeg' }
];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'fr';
    
    const contentPath = path.join(process.cwd(), 'content', 'realisations');
    let realisations = [];
    
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(contentPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const realisation = JSON.parse(content);
          // S'assurer que mediaType est défini pour la rétrocompatibilité
          if (!realisation.mediaType) {
            realisation.mediaType = 'image';
          }
          realisations.push(realisation);
        }
      }
    }
    
    // Si aucun fichier trouvé, utiliser les données par défaut
    if (realisations.length === 0) {
      realisations = [...defaultRealisations];
    }
    
    // Trier par ID
    realisations.sort((a, b) => a.id - b.id);
    
    // ✅ Appliquer la traduction si nécessaire
    if (lang !== 'fr' && cmsTranslations.realisations[lang as keyof typeof cmsTranslations.realisations]) {
      const translations = cmsTranslations.realisations[lang as keyof typeof cmsTranslations.realisations];
      const translatedRealisations = realisations.map((r, idx) => ({
        ...r,
        title: translations[idx] || r.title
      }));
      return NextResponse.json({ success: true, realisations: translatedRealisations });
    }
    
    return NextResponse.json({ success: true, realisations });
  } catch (error) {
    console.error('Erreur lecture réalisations:', error);
    const lang = new URL(request.url).searchParams.get('lang') || 'fr';
    let defaultData = [...defaultRealisations];
    if (lang !== 'fr' && cmsTranslations.realisations[lang as keyof typeof cmsTranslations.realisations]) {
      const translations = cmsTranslations.realisations[lang as keyof typeof cmsTranslations.realisations];
      defaultData = defaultData.map((r, idx) => ({
        ...r,
        title: translations[idx] || r.title
      }));
    }
    return NextResponse.json({ success: true, realisations: defaultData });
  }
}