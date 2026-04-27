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
    console.log('📝 Commande reçue:', { 
      clientName: commande.clientName, 
      budget: commande.budget,
      hasDestName: !!commande.destName 
    });
    
    const savedCommande = await saveCommand(commande);
    console.log('✅ Commande sauvegardée:', savedCommande.id);
    
    // WhatsApp - optionnel, ne bloque pas si erreur
    try {
      const entreprisePhone = process.env.ENTREPRISE_WHATSAPP || '250799366007';
      await sendWhatsApp(entreprisePhone, formatCommandeMessage(savedCommande));
      if (commande.clientPhone) {
        await sendWhatsApp(commande.clientPhone, formatConfirmationClient(savedCommande));
      }
    } catch (whatsappError) {
      console.log('⚠️ WhatsApp non configuré:', whatsappError.message);
    }
    
    // Google Sheets - optionnel
    try {
      const { addToGoogleSheets } = require('../../lib/googleSheets.js');
      await addToGoogleSheets(commande);
    } catch (e) {
      console.log('Google Sheets non configuré');
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, commandeId: savedCommande.id })
    };
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};