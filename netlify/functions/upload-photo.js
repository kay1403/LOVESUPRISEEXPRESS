const { savePhoto } = require('../lib/utils/netlify-blobs.js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Vérification admin
  const adminKey = event.headers.authorization;
  if (adminKey !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Non autorisé' })
    };
  }

  try {
    const { photoBase64, category } = JSON.parse(event.body);
    
    if (!photoBase64) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Photo requise' })
      };
    }

    // Convertir base64 en buffer
    const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const saved = await savePhoto(buffer, category || 'realisation');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, photo: saved })
    };
  } catch (error) {
    console.error('Erreur upload:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
