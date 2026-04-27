const jwt = require('jsonwebtoken');

exports.verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    try {
      // Décode le token sans vérifier la signature
      const decoded = jwt.decode(token);
      
      // Vérifie que le token a un email et n'est pas expiré
      if (!decoded || !decoded.email) {
        return reject(new Error('Token invalide: pas d\'email'));
      }
      
      // Vérifie l'expiration
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        return reject(new Error('Token expiré'));
      }
      
      console.log('✅ Token valide pour:', decoded.email);
      resolve(decoded);
    } catch (err) {
      reject(err);
    }
  });
};

exports.isAdmin = async (event) => {
  try {
    const authHeader = event.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Pas de Bearer token');
      return false;
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = await exports.verifyToken(token);
    
    const allowedEmails = (process.env.ADMIN_EMAILS || 'mekuiadele271@gmail.com').split(',');
    const isAllowed = allowedEmails.includes(decoded.email);
    
    console.log(`📧 ${decoded.email} est admin: ${isAllowed}`);
    return isAllowed;
  } catch (error) {
    console.error('❌ Erreur isAdmin:', error.message);
    return false;
  }
};