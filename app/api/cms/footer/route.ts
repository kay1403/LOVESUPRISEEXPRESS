// app/api/cms/footer/route.ts - VERSION FINALE CORRECTE
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cmsTranslations } from '@/lib/cms-translations';

export const dynamic = 'force-dynamic';

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
  services: ["Party Decoration", "Surprise Planner", "Flower Bouquet", "Gift Baskets"],
  copyright: "Tous droits réservés",
  year: new Date().getFullYear()
};

export async function GET(request: Request) {
  console.log('🚀 FOOTER API CALLED');
  
  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'fr';
    
    // Chercher le fichier JSON
    const possiblePaths = [
      path.join(process.cwd(), 'content', 'footer', 'config.json'),
      path.join(process.cwd(), '.next', 'server', 'content', 'footer', 'config.json'),
    ];
    
    let footerData = null;
    
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        footerData = JSON.parse(content);
        console.log(`✅ Footer chargé depuis: ${filePath}`);
        break;
      }
    }
    
    // Fusion avec les valeurs par défaut
    let footer = { ...DEFAULT_FOOTER, ...footerData };
    
    // ✅ APPLIQUER LES TRADUCTIONS SELON LA LANGUE
    if (lang !== 'fr' && cmsTranslations.footer?.[lang as keyof typeof cmsTranslations.footer]) {
      const t = cmsTranslations.footer[lang as keyof typeof cmsTranslations.footer];
      footer = {
        ...footer,
        slogan: t.slogan || footer.slogan,
        hours: (t.hours && Array.isArray(t.hours)) ? t.hours : footer.hours,
        copyright: t.copyright || footer.copyright,
      };
    }
    
    console.log(`📦 Footer pour ${lang}: companyName="${footer.companyName}"`);
    
    // Retourner avec headers anti-cache
    return NextResponse.json(
      { success: true, footer },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'CDN-Cache-Control': 'no-cache',
        }
      }
    );
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json({ success: true, footer: DEFAULT_FOOTER });
  }
}