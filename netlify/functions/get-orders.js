const { getCommandes } = require('../../lib/utils/netlify-blobs.js');
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

  console.log('🔍 get-orders appelée');
  console.log('🔍 Headers keys:', Object.keys(event.headers || {}));

  const admin = await isAdmin(event);
  console.log('👑 Est admin?', admin);
  
  if (!admin) {
    console.log('❌ Non autorisé - retour 401');
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Non autorisé' })
    };
  }

  try {
    const commandes = await getCommandes();
    console.log(`✅ ${commandes.length} commandes retournées`);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, commandes })
    };
  } catch (error) {
    console.error('❌ Erreur getCommandes:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};