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

  const admin = await isAdmin(event);
  if (!admin) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Non autorisé' })
    };
  }

  try {
    const commandes = await getCommandes();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, commandes })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
