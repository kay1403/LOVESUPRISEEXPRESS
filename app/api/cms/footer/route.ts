import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

export async function GET() {
  try {
    const contentPath = path.join(process.cwd(), 'content', 'footer');
    
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(contentPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const footer = JSON.parse(content);
          return NextResponse.json({ success: true, footer });
        }
      }
    }
    
    return NextResponse.json({ success: true, footer: defaultFooter });
  } catch (error) {
    console.error('Erreur lecture footer:', error);
    return NextResponse.json({ success: true, footer: defaultFooter });
  }
}
