const { sendWhatsApp } = require('../lib/utils/whatsapp.js');

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
    const { phone, message } = JSON.parse(event.body);
    
    if (!phone || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Téléphone et message requis' })
      };
    }

    const result = await sendWhatsApp(phone, message);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: result })
    };
  } catch (error) {
    console.error('Erreur envoi WhatsApp:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
