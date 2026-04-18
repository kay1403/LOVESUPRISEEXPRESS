// Utilitaires pour notifications WhatsApp via CallMeBot API
// API gratuite: https://www.callmebot.com/blog/free-api-whatsapp-messages/

const CALLMEBOT_API = 'https://api.callmebot.com/whatsapp.php';

export async function sendWhatsApp(phoneNumber, message) {
  // Format du numéro: 25078XXXXXXXX (sans +)
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  
  // Récupérer la clé API depuis les variables d'environnement
  const apiKey = process.env.CALLMEBOT_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️ Pas de clé API CallMeBot, notification non envoyée');
    console.log('Message aurait été:', message);
    return false;
  }

  const params = new URLSearchParams({
    phone: cleanPhone,
    text: message,
    apikey: apiKey
  });

  try {
    const response = await fetch(`${CALLMEBOT_API}?${params}`);
    const result = await response.text();
    console.log('WhatsApp envoyé à', cleanPhone, ':', result);
    return true;
  } catch (error) {
    console.error('Erreur envoi WhatsApp:', error);
    return false;
  }
}

export function formatCommandeMessage(commande) {
  return `
🆕 NOUVELLE COMMANDE LoveExpress !

━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CLIENT: ${commande.clientName}
📞 TEL: ${commande.clientPhone}
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎁 DESTINATAIRE: ${commande.destName}
📍 ADRESSE: ${commande.destAddress}
━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 ÉVÉNEMENT: ${commande.eventType}
🗓️ DATE: ${commande.eventDate}
━━━━━━━━━━━━━━━━━━━━━━━━━━
�� BUDGET: ${parseInt(commande.budget).toLocaleString()} RWF
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Répondre sur WhatsApp: ${commande.clientPhone}
  `.trim();
}

export function formatConfirmationClient(commande) {
  return `
✅ Merci ${commande.clientName} !

Votre demande LoveExpress a bien été reçue.

📋 RÉCAPITULATIF:
• Destinataire: ${commande.destName}
• Événement: ${commande.eventType}
• Date: ${commande.eventDate}
• Budget: ${parseInt(commande.budget).toLocaleString()} RWF

📄 Vous allez recevoir votre récapitulatif en PDF.

⏰ Nous vous répondons sous 30 minutes.

❤️ LoveExpress - Nous livrons l'amour et la gentillesse
  `.trim();
}
