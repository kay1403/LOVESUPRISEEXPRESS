const { getStore } = require('../../lib/utils/netlify-blobs.js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=31536000',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const params = new URLSearchParams(event.queryStringParameters);
    const id = params.get('id');
    
    if (!id) {
      console.error('❌ get-photo: id manquant');
      return { statusCode: 400, body: 'Missing id' };
    }
    
    console.log(`🔍 get-photo: recherche photo ${id}`);
    
    const store = await getStore('photos');
    const raw = await store.get(id);
    
    if (!raw) {
      console.error(`❌ get-photo: photo ${id} non trouvée`);
      return { statusCode: 404, body: 'Photo not found' };
    }
    
    // ✅ CORRECTION: parser le JSON stocké
    let photoData;
    try {
      photoData = typeof raw === 'string' ? JSON.parse(raw) : raw;
      console.log(`✅ get-photo: photo ${id} parsée, a data? ${!!photoData?.data}`);
    } catch (e) {
      console.error(`❌ get-photo: erreur parsing JSON pour ${id}:`, e.message);
      return { statusCode: 500, body: 'Corrupted photo data' };
    }
    
    if (!photoData?.data) {
      console.error(`❌ get-photo: photo ${id} sans données base64`);
      return { statusCode: 404, body: 'Photo data missing' };
    }
    
    // ✅ Détection du type MIME à partir du base64
    const base64 = photoData.data;
    let contentType = 'image/jpeg';
    if (base64.startsWith('/9j/')) contentType = 'image/jpeg';
    else if (base64.startsWith('iVBOR')) contentType = 'image/png';
    else if (base64.startsWith('R0lGOD')) contentType = 'image/gif';
    else if (base64.startsWith('UklGR')) contentType = 'image/webp';
    
    console.log(`✅ get-photo: retour photo ${id}, type ${contentType}`);
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': contentType,
      },
      body: base64,
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('❌ get-photo: erreur générale:', error.message);
    return { statusCode: 500, body: 'Internal error' };
  }
};