const { saveCommand, getStore } = require('../lib/utils/netlify-blobs.js');
const { sendWhatsApp, formatCommandeMessage, formatConfirmationClient } = require('../lib/utils/whatsapp.js');

exports.handler = async (event) => {
  // Autoriser CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const commande = JSON.parse(event.body);
    
    // 1. Sauvegarder dans Netlify Blobs (stockage principal)
    const savedCommande = await saveCommand(commande);
    
    // 2. Backup dans Google Sheets (si configuré)
    let googleSheetsSaved = false;
    try {
      const { addToGoogleSheets } = require('../lib/googleSheets.js');
      googleSheetsSaved = await addToGoogleSheets(commande);
    } catch (e) {
      console.log('Google Sheets non configuré, backup ignoré');
    }
    
    // 3. Envoyer notification WhatsApp à l'entreprise
    const entreprisePhone = process.env.ENTREPRISE_WHATSAPP || '250799366007';
    const messageEntreprise = formatCommandeMessage(savedCommande);
    await sendWhatsApp(entreprisePhone, messageEntreprise);
    
    // 4. Envoyer confirmation WhatsApp au client
    const messageClient = formatConfirmationClient(savedCommande);
    await sendWhatsApp(commande.clientPhone, messageClient);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        commandeId: savedCommande.id,
        googleSheetsBackup: googleSheetsSaved
      })
    };
    
  } catch (error) {
    console.error('Erreur:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
