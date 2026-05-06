// app/api/cms/footer/route.ts - VERSION CORRIGÉE
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
      // ✅ Lire TOUS les fichiers JSON et prendre le PLUS RÉCENT
      const files = fs.readdirSync(contentPath)
        .filter(f => f.endsWith('.json'))
        .map(f => ({
          name: f,
          path: path.join(contentPath, f),
          mtime: fs.statSync(path.join(contentPath, f)).mtime.getTime()
        }))
        .sort((a, b) => b.mtime - a.mtime); // Plus récent en premier
      
      if (files.length > 0) {
        usedFile = files[0].name;
        const content = fs.readFileSync(files[0].path, 'utf-8');
        footerData = JSON.parse(content);
        console.log(`✅ Footer chargé depuis: ${usedFile} (modifié le ${new Date(files[0].mtime).toISOString()})`);
      }
      
      // ⚠️ Log d'avertissement si plusieurs fichiers
      if (files.length > 1) {
        console.warn(`⚠️ Plusieurs fichiers footer trouvés: ${files.map(f => f.name).join(', ')}. Utilisation du plus récent: ${usedFile}`);
      }
    }
    
    // ✅ Fusion simple sans validateFooter qui écrase
    let footer = footerData ? { ...DEFAULT_FOOTER, ...footerData } : DEFAULT_FOOTER;
    
    // ✅ Appliquer traduction si nécessaire (sans casser la structure)
    if (lang !== 'fr' && cmsTranslations.footer?.[lang as keyof typeof cmsTranslations.footer]) {
      const t = cmsTranslations.footer[lang as keyof typeof cmsTranslations.footer];
      footer = {
        ...footer,
        ...(t.companyName && { companyName: t.companyName }),
        ...(t.slogan && { slogan: t.slogan }),
        ...(t.hours && Array.isArray(t.hours) && { hours: t.hours }),
        ...(t.copyright && { copyright: t.copyright }),
      };
    }
    
    return NextResponse.json({ success: true, footer });
  } catch (error) {
    console.error('❌ Erreur lecture footer:', error);
    return NextResponse.json({ success: true, footer: DEFAULT_FOOTER });
  }
}