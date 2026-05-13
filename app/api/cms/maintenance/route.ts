// app/api/cms/maintenance/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DEFAULT_MAINTENANCE = {
  enabled: false,
  message: "Le formulaire de commande est temporairement désactivé pour maintenance. Veuillez nous contacter directement par WhatsApp pour toute demande.",
  endDate: "",
  contactEmail: "",
  showWhatsApp: true
};

export async function GET() {
  try {
    const possiblePaths = [
      path.join(process.cwd(), 'content', 'maintenance', 'config.json'),
      path.join(process.cwd(), '.next', 'server', 'content', 'maintenance', 'config.json'),
    ];
    
    let maintenanceData = null;
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        maintenanceData = JSON.parse(content);
        console.log(`✅ Maintenance chargé depuis: ${filePath}`);
        break;
      }
    }
    
    const maintenance = { ...DEFAULT_MAINTENANCE, ...maintenanceData };
    
    // ✅ Important : retourner la valeur enabled telle quelle
    return NextResponse.json(
      { success: true, maintenance },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error) {
    console.error('❌ Erreur maintenance:', error);
    return NextResponse.json({ success: true, maintenance: DEFAULT_MAINTENANCE });
  }
}