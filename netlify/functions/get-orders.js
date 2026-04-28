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

  // 🔍 DEBUG TEMPORAIRE — à retirer après
  console.log('🔍 AUTH HEADER:', event.headers?.authorization?.substring(0, 60));
  console.log('🔍 ALL HEADERS:', JSON.stringify(Object.keys(event.headers || {})));
  
  // Test direct de Blobs
  try {
    const { getStore } = require('../../lib/utils/netlify-blobs.js');
    const testStore = await getStore('commandes');
    const testResult = await testStore.list();
    console.log('🔍 BLOBS STRUCTURE:', JSON.stringify(Object.keys(testResult)));
    console.log('🔍 BLOBS COUNT:', (testResult.blobs ?? testResult.items ?? []).length);
  } catch (err) {
    console.error('🔍 BLOBS TEST ERROR:', err.message);
  }

  console.log('🔍 isAdmin check...');
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