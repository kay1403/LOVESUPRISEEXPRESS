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
    
    // Gérer la photo si présente
    let photoUrl = null;
    if (avis.photoBase64 && avis.hasPhoto) {
      try {
        // Extraire le base64 et sauvegarder
        const base64Data = avis.photoBase64.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const photo = await savePhoto(buffer, 'testimonials');
        photoUrl = photo.url;
      } catch (photoError) {
        console.error('Erreur sauvegarde photo:', photoError);
      }
    }
    
    // Ne pas stocker la base64 dans l'avis (trop gros)
    delete avis.photoBase64;
    
    const savedAvis = await saveAvis({
      ...avis,
      photoUrl
    });
    
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