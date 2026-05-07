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
    let footerData = null;
    let usedFile = null;
    
    if (fs.existsSync(contentPath)) {
      // ✅ Tri par ordre alphabétique INVERSÉ (config-1.json avant config.json)
      // Netlify ne préserve pas les mtime donc on utilise le nom
      const files = fs.readdirSync(contentPath)
        .filter(f => f.endsWith('.json'))
        .sort((a, b) => b.localeCompare(a)); // ← config-1 avant config
      
      if (files.length > 0) {
        usedFile = files[0];
        const filePath = path.join(contentPath, files[0]);
        const content = fs.readFileSync(filePath, 'utf-8');
        footerData = JSON.parse(content);
        console.log(`✅ Footer chargé depuis: ${usedFile}`);
      }
      
      // ⚠️ Log d'avertissement si plusieurs fichiers
      if (files.length > 1) {
        console.warn(`⚠️ Plusieurs fichiers footer trouvés: ${files.join(', ')}. Utilisation du plus récent alphabétique: ${usedFile}`);
      }
    }
    
    // ✅ Fusion : les données CMS écrasent les valeurs par défaut
    let footer = footerData ? { ...DEFAULT_FOOTER, ...footerData } : DEFAULT_FOOTER;
    
    // ✅ Appliquer traduction UNIQUEMENT pour les champs textuels
    // Ne JAMAIS écraser companyName, phone1, phone2, address (éditables uniquement via CMS)
    if (lang !== 'fr' && cmsTranslations.footer?.[lang as keyof typeof cmsTranslations.footer]) {
      const t = cmsTranslations.footer[lang as keyof typeof cmsTranslations.footer];
      footer = {
        ...footer,
        // ✅ Seulement les champs TEXTUELS traduisibles
        ...(t.slogan && { slogan: t.slogan }),
        ...(t.hours && Array.isArray(t.hours) && { hours: t.hours }),
        ...(t.copyright && { copyright: t.copyright }),
        // ❌ companyName, phone1, phone2, address → toujours depuis le CMS, jamais de la traduction
      };
    }
    
    console.log(`📦 Footer retourné pour langue ${lang}: companyName="${footer.companyName}"`);
    
    return NextResponse.json({ success: true, footer });
  } catch (error) {
    console.error('❌ Erreur lecture footer:', error);
    return NextResponse.json({ success: true, footer: DEFAULT_FOOTER });
  }
}