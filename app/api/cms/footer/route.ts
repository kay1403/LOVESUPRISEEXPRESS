// app/api/cms/footer/route.ts - VERSION UNIFIÉE ET ROBUSTE (SANS ERREUR TS)
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cmsTranslations } from '@/lib/cms-translations';

// Structure unifiée - CE FORMAT EST LE SEUL VALABLE
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

// Interface pour typer les heures
interface Hour {
  day: string;
  time: string;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'fr';
    
    const contentPath = path.join(process.cwd(), 'content', 'footer');
    let footerData: any = null;
    let usedFile: string | null = null;
    
    // Lecture du fichier CMS
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath)
        .filter(f => f.endsWith('.json'))
        .sort((a, b) => b.localeCompare(a));
      
      if (files.length > 0) {
        usedFile = files[0];
        const filePath = path.join(contentPath, files[0]);
        const content = fs.readFileSync(filePath, 'utf-8');
        footerData = JSON.parse(content);
        console.log(`✅ Footer chargé depuis: ${usedFile}`);
      }
    }
    
    // Fusion intelligente avec validation des types
    let footer = { ...DEFAULT_FOOTER };
    
    if (footerData) {
      // Mise à jour uniquement des champs présents
      if (footerData.companyName) footer.companyName = footerData.companyName;
      if (footerData.slogan) footer.slogan = footerData.slogan;
      if (footerData.phone1) footer.phone1 = footerData.phone1;
      if (footerData.phone2) footer.phone2 = footerData.phone2;
      if (footerData.address) footer.address = footerData.address;
      if (footerData.copyright) footer.copyright = footerData.copyright;
      if (footerData.year) footer.year = footerData.year;
      
      // Traitement spécial pour hours (doit être un tableau valide)
      if (footerData.hours && Array.isArray(footerData.hours) && footerData.hours.length > 0) {
        footer.hours = footerData.hours.map((h: Hour) => ({
          day: h.day || "",
          time: h.time || ""
        }));
      }
      
      // Traitement spécial pour services
      if (footerData.services && Array.isArray(footerData.services) && footerData.services.length > 0) {
        footer.services = footerData.services;
      }
    }
    
    // Application de la traduction (uniquement pour les langues non-françaises)
    if (lang !== 'fr' && cmsTranslations.footer?.[lang as keyof typeof cmsTranslations.footer]) {
      const t = cmsTranslations.footer[lang as keyof typeof cmsTranslations.footer];
      if (t.slogan) footer.slogan = t.slogan;
      if (t.hours && Array.isArray(t.hours)) footer.hours = t.hours;
      if (t.copyright) footer.copyright = t.copyright;
    }
    
    console.log(`📦 Footer: companyName="${footer.companyName}", hours.length=${footer.hours.length}`);
    
    return NextResponse.json({ success: true, footer });
  } catch (error) {
    console.error('❌ Erreur footer:', error);
    return NextResponse.json({ success: true, footer: DEFAULT_FOOTER });
  }
}