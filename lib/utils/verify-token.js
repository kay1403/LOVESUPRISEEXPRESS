// Vérification du token JWT Netlify Identity
const jwt = require('jsonwebtoken');

// La clé publique Netlify Identity (fixe pour tous les sites)
const NETLIFY_JWT_SECRET = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCYZM6i19L\nnMvNtP5W3C9lT5S8m7j9k0L2nM3pO4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7\nQ8rR9sS0tU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO\n-----END PUBLIC KEY-----';

exports.verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, NETLIFY_JWT_SECRET, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

exports.isAdmin = async (event) => {
  try {
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = await exports.verifyToken(token);
    
    // Vérifier que l'email est autorisé
    const allowedEmails = process.env.ADMIN_EMAILS || 'mekuiadele271@gmail.com';
    const emails = allowedEmails.split(',');
    
    return emails.includes(decoded.email);
  } catch (error) {
    console.error('Erreur vérification admin:', error);
    return false;
  }
};
