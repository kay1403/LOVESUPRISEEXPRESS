'use client';

import { useEffect } from 'react';

export default function IdentityProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Vérifier si on est sur la page d'accueil ou n'importe quelle page
    const initIdentity = async () => {
      const module = await import('netlify-identity-widget');
      const netlifyIdentity = module.default || module;
      
      netlifyIdentity.init({
        APIUrl: process.env.NEXT_PUBLIC_NETLIFY_URL || window.location.origin,
      });

      // Vérifier s'il y a un token d'invitation dans l'URL
      const hash = window.location.hash;
      if (hash && hash.includes('invite_token')) {
        console.log('🆔 Token d\'invitation détecté, ouverture de la popup...');
        // Ouvrir automatiquement la popup de confirmation
        setTimeout(() => {
          netlifyIdentity.open();
        }, 100);
      }

      // Écouter les changements de hash (pour les redirections après login)
      const handleHashChange = () => {
        const newHash = window.location.hash;
        if (newHash && newHash.includes('invite_token')) {
          netlifyIdentity.open();
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      
      // Nettoyage
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
    };

    initIdentity();
  }, []);

  return null;
}
