// lib/utils/verify-token.js
const jwt = require('jsonwebtoken');

exports.verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('🔍 verifyToken - début');
      console.log('📝 Token reçu (début):', token.substring(0, 30) + '...');
      console.log('📝 Token longueur:', token.length);
      
      // Décoder le token
      const decoded = jwt.decode(token);
      console.log('📝 Decoded:', JSON.stringify(decoded, null, 2));
      
      if (!decoded) {
        console.log('❌ Decoded est null');
        return reject(new Error('Impossible de décoder le token'));
      }
      
      if (!decoded.email) {
        console.log('❌ Pas d\'email dans le token');
        return reject(new Error('Token sans email'));
      }
      
      // Vérifier expiration
      const now = Math.floor(Date.now() / 1000);
      console.log(`📅 Now: ${now}, Exp: ${decoded.exp}, Diff: ${decoded.exp - now}s`);
      if (decoded.exp && decoded.exp < now) {
        console.log('❌ Token expiré');
        return reject(new Error('Token expiré'));
      }
      
      console.log('✅ Token valide:', decoded.email);
      resolve(decoded);
    } catch (err) {
      console.error('❌ Erreur verifyToken:', err.message);
      reject(err);
    }
  });
};

exports.isAdmin = async (event) => {
  try {
    console.log('🔍 isAdmin appelé');
    
    const authHeader = event.headers.authorization;
    console.log('📋 Auth header présent?', !!authHeader);
    console.log('📋 Auth header:', authHeader ? authHeader.substring(0, 50) + '...' : 'null');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Pas de Bearer token - retour false');
      return false;
    }
    
    const token = authHeader.split(' ')[1];
    console.log('🔑 Token extrait (début):', token.substring(0, 30) + '...');
    
    const decoded = await exports.verifyToken(token);
    console.log('📧 Email décodé:', decoded.email);
    
    const allowedEmails = process.env.ADMIN_EMAILS || 'mekuiadele271@gmail.com';
    const allowedList = allowedEmails.split(',');
    console.log('📧 Emails autorisés:', allowedList);
    
    const isAllowed = allowedList.includes(decoded.email);
    
    console.log(`✅ ${decoded.email} est admin: ${isAllowed}`);
    return isAllowed;
  } catch (error) {
    console.error('❌ Erreur isAdmin:', error.message);
    return false;
  }
};