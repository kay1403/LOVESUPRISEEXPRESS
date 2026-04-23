const CALLMEBOT_API = 'https://api.callmebot.com/whatsapp.php';

export async function sendWhatsApp(phoneNumber, message) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const apiKey = process.env.CALLMEBOT_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️ Pas de clé API CallMeBot');
    return false;
  }

  const params = new URLSearchParams({ phone: cleanPhone, text: message, apikey: apiKey });

  try {
    const response = await fetch(`${CALLMEBOT_API}?${params}`);
    return true;
  } catch (error) {
    console.error('Erreur envoi WhatsApp:', error);
    return false;
  }
}

export function formatCommandeMessage(commande) {
  return `🆕 NOUVELLE COMMANDE !\nClient: ${commande.clientName}\nTel: ${commande.clientPhone}\nDestinataire: ${commande.destName}\nDate: ${commande.eventDate}\nBudget: ${parseInt(commande.budget).toLocaleString()} RWF`;
}

export function formatConfirmationClient(commande) {
  return `✅ Merci ${commande.clientName} ! Votre demande a bien été reçue. Nous vous répondons sous 30 min.`;
}
