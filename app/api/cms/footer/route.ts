// app/api/cms/footer/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // ← AJOUTER OBLIGATOIREMENT

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
    
    // Chercher le fichier à plusieurs endroits
    const possiblePaths = [
      path.join(process.cwd(), 'content', 'footer', 'config.json'),
      path.join(process.cwd(), '.next', 'server', 'content', 'footer', 'config.json'),
      path.join(process.env.PWD || '', 'content', 'footer', 'config.json'),
    ];
    
    let footerData = null;
    let loadedFrom = null;
    
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        footerData = JSON.parse(content);
        loadedFrom = filePath;
        console.log(`✅ Footer chargé depuis: ${loadedFrom}`);
        break;
      }
    }
    
    if (!footerData) {
      console.log('⚠️ Aucun fichier footer trouvé, utilisation du fallback');
      return NextResponse.json({ success: true, footer: DEFAULT_FOOTER });
    }
    
    // Fusionner avec les valeurs par défaut pour les champs manquants
    const footer = {
      ...DEFAULT_FOOTER,
      ...footerData,
    };
    
    console.log(`📦 Footer retourné: companyName="${footer.companyName}"`);
    
    return NextResponse.json({ success: true, footer });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json({ success: true, footer: DEFAULT_FOOTER });
  }
}