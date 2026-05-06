// lib/whatsapp-service.ts
import { Client, LocalAuth } from 'whatsapp-web.js';
const qrcode: any = require('qrcode-terminal');

let client: Client | null = null;
let isReady = false;

// Initialiser le client WhatsApp
export async function initWhatsAppClient() {
  if (client && isReady) return client;
  
  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  // Générer le QR code pour la connexion
  client.on('qr', (qr) => {
    console.log('Scannez ce QR code avec WhatsApp Business:');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('✅ WhatsApp Business connecté!');
    isReady = true;
  });

  client.on('auth_failure', (msg) => {
    console.error('❌ Échec authentification:', msg);
  });

  await client.initialize();
  return client;
}

// Envoyer un message
export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const whatsapp = await initWhatsAppClient();
    if (!isReady) {
      console.log('WhatsApp pas encore prêt');
      return false;
    }
    
    // Nettoyer le numéro (ex: +250799366007 -> 250799366007@c.us)
    const cleanNumber = to.replace(/[^0-9]/g, '');
    const chatId = `${cleanNumber}@c.us`;
    
    await whatsapp.sendMessage(chatId, message);
    console.log(`✅ Message envoyé à ${to}`);
    return true;
  } catch (error) {
    console.error('Erreur envoi:', error);
    return false;
  }
}

// Formater les messages
export function formatCommandeMessage(commande: any) {
  return `🆕 *NOUVELLE COMMANDE* 🆕

👤 Client: ${commande.clientName}
📱 Tél: ${commande.clientPhone}
🎁 Destinataire: ${commande.destName}
📅 Date: ${commande.eventDate}
💰 Budget: ${parseInt(commande.budget).toLocaleString()} RWF

📝 Message: ${commande.message || 'Aucun'}

🔔 *Nouvelle commande à traiter*`;
}

export function formatConfirmationClient(commande: any) {
  return `✅ *COMMANDE REÇUE* ✅

Bonjour ${commande.clientName} 👋

Nous avons bien reçu votre demande d'organisation.

📋 Récap:
- Événement: ${commande.eventDate}
- Budget: ${parseInt(commande.budget).toLocaleString()} RWF

Nous vous répondrons dans les 30 minutes ⏰

Merci de votre confiance ! ❤️`;
}