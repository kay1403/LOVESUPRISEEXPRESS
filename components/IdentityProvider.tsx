'use client';

import { useEffect } from 'react';

export default function IdentityProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let netlifyIdentity: any = null;

    const initIdentity = async () => {
      const module = await import('netlify-identity-widget');
      netlifyIdentity = module.default || module;
      
      netlifyIdentity.init({
        APIUrl: process.env.NEXT_PUBLIC_NETLIFY_URL || window.location.origin,
      });

      // Vérifier s'il y a un token d'invitation dans l'URL (#invite_token)
      const hash = window.location.hash;
      if (hash && hash.includes('invite_token')) {
        console.log('🆔 Token d\'invitation détecté, ouverture automatique de la popup...');
        // Attendre que le DOM soit prêt
        setTimeout(() => {
          netlifyIdentity.open();
        }, 500);
      }

      // Écouter les changements de hash (si l'utilisateur arrive pendant le chargement)
      const handleHashChange = () => {
        const newHash = window.location.hash;
        if (newHash && newHash.includes('invite_token')) {
          netlifyIdentity.open();
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        window.removeEventListener('load', handleHashChange);
      };
    };

    initIdentity();
  }, []);

  return null;
}
