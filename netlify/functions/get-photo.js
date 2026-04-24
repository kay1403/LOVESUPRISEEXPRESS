const { getStore } = require('../../lib/utils/netlify-blobs.js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'image/jpeg',
    'Cache-Control': 'public, max-age=31536000'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const params = new URLSearchParams(event.queryStringParameters);
    const id = params.get('id');
    
    if (!id) {
      return { statusCode: 400, body: 'Missing id' };
    }
    
    const store = await getStore('photos');
    const photoData = await store.get(id);
    
    if (!photoData || !photoData.data) {
      return { statusCode: 404, body: 'Photo not found' };
    }
    
    const buffer = Buffer.from(photoData.data, 'base64');
    
    return {
      statusCode: 200,
      headers,
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Erreur:', error);
    return { statusCode: 500, body: 'Internal error' };
  }
};