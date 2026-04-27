const { saveAvis, savePhoto } = require('../../lib/utils/netlify-blobs.js');

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
    
    let photoUrl = null;
    if (avis.photoBase64 && avis.hasPhoto && avis.photoBase64.includes(',')) {
      try {
        const base64Data = avis.photoBase64.split(',')[1];
        if (base64Data && base64Data.length > 100) {
          const buffer = Buffer.from(base64Data, 'base64');
          const photo = await savePhoto(buffer, 'testimonials');
          photoUrl = photo.url;
        }
      } catch (photoError) {
        console.error('Erreur photo:', photoError.message);
      }
    }
    
    delete avis.photoBase64;
    
    const savedAvis = await saveAvis({
      note: avis.note || 5,
      message: avis.message || '',
      nom: avis.nom || 'Client LoveExpress',
      photoUrl: photoUrl,
      status: 'pending'
    });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        avisId: savedAvis.id,
        message: "Merci pour votre avis !"
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