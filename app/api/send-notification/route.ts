import { NextResponse } from 'next/server';
import { addToGoogleSheets } from '@/lib/googleSheets';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Sauvegarde OBLIGATOIRE dans Google Sheets
    const saved = await addToGoogleSheets(data);
    
    // Message de notification
    const message = `
🔔 NOUVELLE DEMANDE SURPRISE !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CLIENT
Nom: ${data.clientName}
Téléphone: ${data.clientPhone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎁 DESTINATAIRE
Nom: ${data.destName}
Adresse: ${data.destAddress}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 ÉVÉNEMENT
Type: ${data.eventType}
Date: ${data.eventDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Budget: ${data.budget} RWF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Google Sheets: ${saved ? 'OK' : 'ÉCHEC'}

👉 Répondre: ${data.clientPhone}
    `;

    console.log(message);
    
    return NextResponse.json({ 
      success: true, 
      googleSheets: saved ? 'saved' : 'failed'
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
