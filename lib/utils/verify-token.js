// lib/utils/verify-token.js
const jwt = require('jsonwebtoken');

exports.verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    try {
      // Vérifier que le token est une string
      if (!token || typeof token !== 'string') {
        return reject(new Error('Token invalide'));
      }
      
      // Décoder le token
      const decoded = jwt.decode(token);
      
      if (!decoded) {
        return reject(new Error('Impossible de décoder le token'));
      }
      
      if (!decoded.email) {
        return reject(new Error('Token sans email'));
      }
      
      // Vérifier expiration
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
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
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Pas de Bearer token');
      return false;
    }
    
    const token = authHeader.split(' ')[1];
    console.log('🔑 Token reçu (début):', token.substring(0, 30) + '...');
    
    const decoded = await exports.verifyToken(token);
    console.log('📧 Email:', decoded.email);
    
    const allowedEmails = process.env.ADMIN_EMAILS || 'mekuiadele271@gmail.com';
    const allowedList = allowedEmails.split(',');
    const isAllowed = allowedList.includes(decoded.email);
    
    console.log(`✅ ${decoded.email} est admin: ${isAllowed}`);
    return isAllowed;
  } catch (error) {
    console.error('❌ Erreur isAdmin:', error.message);
    return false;
  }
};