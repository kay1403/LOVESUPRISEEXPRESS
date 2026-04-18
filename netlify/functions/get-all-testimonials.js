const { getAvis } = require('../lib/utils/netlify-blobs.js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Vérification admin (clé API)
  const adminKey = event.headers.authorization;
  const validKey = process.env.ADMIN_API_KEY || 'loveexpress2024';
  
  if (adminKey !== `Bearer ${validKey}`) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Non autorisé - Clé API invalide' })
    };
  }

  try {
    // Récupérer TOUS les avis (y compris en attente)
    const allAvis = await getAvis(null);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        avis: allAvis,
        stats: {
          total: allAvis.length,
          published: allAvis.filter(a => a.status === 'published').length,
          pending: allAvis.filter(a => a.status === 'pending').length,
          rejected: allAvis.filter(a => a.status === 'rejected').length
        }
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
