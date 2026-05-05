import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cmsTranslations } from '@/lib/cms-translations';

const defaultFooter = {
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
  services: [
    "Party Decoration",
    "Surprise Planner",
    "Flower Bouquet",
    "Gift Baskets"
  ],
  copyright: "Tous droits réservés",
  year: new Date().getFullYear()
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'fr';
    
    const contentPath = path.join(process.cwd(), 'content', 'footer');
    let footer = null;
    
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(contentPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          footer = JSON.parse(content);
          break;
        }
      }
    }
    
    // Si aucun fichier trouvé, utiliser les données par défaut
    if (!footer) {
      footer = { ...defaultFooter };
    }
    
    // ✅ Appliquer traduction si nécessaire
    if (lang !== 'fr' && cmsTranslations.footer[lang as keyof typeof cmsTranslations.footer]) {
      const t = cmsTranslations.footer[lang as keyof typeof cmsTranslations.footer];
      footer = { ...footer, ...t };
    }
    
    return NextResponse.json({ success: true, footer });
  } catch (error) {
    console.error('Erreur lecture footer:', error);
    const lang = new URL(request.url).searchParams.get('lang') || 'fr';
    let defaultData = { ...defaultFooter };
    if (lang !== 'fr' && cmsTranslations.footer[lang as keyof typeof cmsTranslations.footer]) {
      defaultData = { ...defaultData, ...cmsTranslations.footer[lang as keyof typeof cmsTranslations.footer] };
    }
    return NextResponse.json({ success: true, footer: defaultData });
  }
}