const { moderateAvis } = require('../../lib/utils/netlify-blobs.js');
const { isAdmin } = require('../../lib/utils/verify-token.js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const admin = await isAdmin(event);
  if (!admin) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Non autorisé' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { id, status } = body;
    
    // Validation des entrées
    if (!id || typeof id !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'ID invalide' })
      };
    }
    
    if (!status || !['published', 'rejected'].includes(status)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Statut invalide' })
      };
    }
    
    const updated = await moderateAvis(id, status);
    console.log(`✅ Avis ${id} modéré en ${status}`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, avis: updated })
    };
  } catch (error) {
    console.error('Erreur modération:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};