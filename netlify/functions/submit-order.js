const { saveCommand } = require('../../lib/utils/netlify-blobs.js');
const { sendWhatsApp, formatCommandeMessage, formatConfirmationClient } = require('../../lib/utils/whatsapp.js');

exports.handler = async (event) => {
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
    
    const savedCommande = await saveCommand(commande);
    
    let googleSheetsSaved = false;
    try {
      const { addToGoogleSheets } = require('../../lib/googleSheets.js');
      googleSheetsSaved = await addToGoogleSheets(commande);
    } catch (e) {
      console.log('Google Sheets non configuré, backup ignoré');
    }
    
    const entreprisePhone = process.env.ENTREPRISE_WHATSAPP || '250799366007';
    const messageEntreprise = formatCommandeMessage(savedCommande);
    await sendWhatsApp(entreprisePhone, messageEntreprise);
    
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
