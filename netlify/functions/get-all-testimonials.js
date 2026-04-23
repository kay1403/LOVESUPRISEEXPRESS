const { getAvis } = require('../../lib/utils/netlify-blobs.js');
const { isAdmin } = require('../../lib/utils/verify-token.js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Vérifier que l'utilisateur est admin via Netlify Identity
  const admin = await isAdmin(event);
  if (!admin) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Non autorisé - Connectez-vous avec un compte admin' })
    };
  }

  try {
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
