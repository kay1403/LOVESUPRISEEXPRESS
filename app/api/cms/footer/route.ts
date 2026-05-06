// app/api/cms/footer/route.ts (corrigé - ligne 85)
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cmsTranslations } from '@/lib/cms-translations';

// Structure par défaut complète et validée
const DEFAULT_FOOTER = {
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

// Fonction pour valider et nettoyer les données du footer
function validateFooter(data: any): any {
  return {
    companyName: data?.companyName || DEFAULT_FOOTER.companyName,
    slogan: data?.slogan || DEFAULT_FOOTER.slogan,
    phone1: data?.phone1 || DEFAULT_FOOTER.phone1,
    phone2: data?.phone2 || DEFAULT_FOOTER.phone2,
    address: data?.address || DEFAULT_FOOTER.address,
    hours: Array.isArray(data?.hours) && data.hours.length > 0 
      ? data.hours.map((h: any) => ({ day: h?.day || '', time: h?.time || '' }))
      : DEFAULT_FOOTER.hours,
    services: Array.isArray(data?.services) && data.services.length > 0
      ? data.services
      : DEFAULT_FOOTER.services,
    copyright: data?.copyright || DEFAULT_FOOTER.copyright,
    year: data?.year || DEFAULT_FOOTER.year,
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'fr';
    
    const contentPath = path.join(process.cwd(), 'content', 'footer');
    let footerData = null;
    
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(contentPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          footerData = JSON.parse(content);
          break;
        }
      }
    }
    
    // Toujours valider les données
    let footer = validateFooter(footerData);
    
    // ✅ Appliquer traduction si nécessaire (sans casser la structure)
    if (lang !== 'fr' && cmsTranslations.footer?.[lang as keyof typeof cmsTranslations.footer]) {
      const t = cmsTranslations.footer[lang as keyof typeof cmsTranslations.footer];
      footer = {
        ...footer,
        // Ne fusionner que les propriétés qui existent dans la traduction
        ...(t.companyName && { companyName: t.companyName }),
        ...(t.slogan && { slogan: t.slogan }),
        ...(t.hours && Array.isArray(t.hours) && { hours: t.hours }),
        ...(t.copyright && { copyright: t.copyright }),
        // 🔧 CORRECTION : Ne pas toucher à services si absent
        services: footer.services, // Garder les services par défaut
      };
    }
    
    return NextResponse.json({ success: true, footer });
  } catch (error) {
    console.error('Erreur lecture footer:', error);
    return NextResponse.json({ success: true, footer: DEFAULT_FOOTER });
  }
}