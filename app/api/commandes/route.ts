// app/api/commandes/route.ts
import { NextResponse } from 'next/server';
import { sendWhatsAppMessage, formatCommandeMessage, formatConfirmationClient } from '@/lib/whatsapp-service';

export async function POST(request: Request) {
  try {
    const commande = await request.json();
    
    // 1. Envoyer la commande à l'admin (WhatsApp Business)
    const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER || '250799366007';
    await sendWhatsAppMessage(adminNumber, formatCommandeMessage(commande));
    
    // 2. Envoyer confirmation au client
    await sendWhatsAppMessage(commande.clientPhone, formatConfirmationClient(commande));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Commande envoyée avec succès' 
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erreur lors de l\'envoi' 
    }, { status: 500 });
  }
}