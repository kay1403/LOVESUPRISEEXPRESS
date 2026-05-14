const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `${process.env.NEXT_PUBLIC_NETLIFY_URL || 'https://lovesupriseexpress.netlify.app'}/.netlify/identity/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('Erreur récupération clé JWKS:', err);
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

exports.verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error('Token manquant'));
    }
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:', err.message);
        return reject(err);
      }
      if (!decoded.email) {
        return reject(new Error('Token sans email'));
      }
      resolve(decoded);
    });
  });
};

exports.isAdmin = async (event) => {
  try {
    const authHeader = event.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    const decoded = await exports.verifyToken(token);
    const allowedEmails = process.env.ADMIN_EMAILS || 'mekuiadele271@gmail.com';
    const allowedList = allowedEmails.split(',');
    return allowedList.includes(decoded.email);
  } catch (error) {
    console.error('isAdmin error:', error.message);
    return false;
  }
};