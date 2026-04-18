const { saveAvis } = require('../lib/utils/netlify-blobs.js');

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
    const avis = JSON.parse(event.body);
    
    // Sauvegarder l'avis (statut 'pending' par défaut)
    const savedAvis = await saveAvis(avis);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        avisId: savedAvis.id,
        message: "Merci pour votre avis ! Il sera publié après validation."
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
