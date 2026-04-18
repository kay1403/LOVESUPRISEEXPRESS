const { moderateAvis, getAvis } = require('../lib/utils/netlify-blobs.js');

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
    const { id, status } = JSON.parse(event.body);
    const updated = await moderateAvis(id, status);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, avis: updated })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
