// app/api/cms/footer/route.ts - VERSION FINALE CORRIGÉE
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'fr';
    
    const contentPath = path.join(process.cwd(), 'content', 'footer');
    console.log('📁 Recherche footer dans:', contentPath);
    
    let footerData = null;
    let usedFile = null;
    
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath)
        .filter(f => f.endsWith('.json'))
        .map(f => ({
          name: f,
          path: path.join(contentPath, f),
          mtime: fs.statSync(path.join(contentPath, f)).mtime.getTime()
        }))
        .sort((a, b) => b.mtime - a.mtime); // Plus récent en premier
      
      console.log(`📁 Fichiers trouvés: ${files.map(f => f.name).join(', ') || 'aucun'}`);
      
      if (files.length > 0) {
        usedFile = files[0].name;
        const content = fs.readFileSync(files[0].path, 'utf-8');
        footerData = JSON.parse(content);
        console.log(`✅ Footer chargé depuis: ${usedFile}`, footerData);
      }
    } else {
      console.log('⚠️ Dossier content/footer inexistant');
    }
    
    // ✅ Fusion : les données CMS écrasent les valeurs par défaut (sauf si absentes)
    let footer = footerData ? { ...DEFAULT_FOOTER, ...footerData } : DEFAULT_FOOTER;
    
    // ✅ Appliquer la traduction pour la langue demandée
    if (lang !== 'fr' && cmsTranslations.footer?.[lang as keyof typeof cmsTranslations.footer]) {
      const t = cmsTranslations.footer[lang as keyof typeof cmsTranslations.footer];
      footer = {
        ...footer,
        companyName: t.companyName || footer.companyName,
        slogan: t.slogan || footer.slogan,
        hours: (t.hours && Array.isArray(t.hours)) ? t.hours : footer.hours,
        copyright: t.copyright || footer.copyright,
      };
    }
    
    console.log(`📦 Footer retourné pour langue ${lang}:`, { companyName: footer.companyName, slogan: footer.slogan });
    
    return NextResponse.json({ success: true, footer });
  } catch (error) {
    console.error('❌ Erreur lecture footer:', error);
    return NextResponse.json({ success: true, footer: DEFAULT_FOOTER });
  }
}