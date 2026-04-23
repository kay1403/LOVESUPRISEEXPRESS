'use client';

import { useEffect } from 'react';

export default function IdentityProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialiser Netlify Identity Widget sur tout le site
    import('netlify-identity-widget').then((module) => {
      const netlifyIdentity = module.default || module;
      netlifyIdentity.init({
        APIUrl: process.env.NEXT_PUBLIC_NETLIFY_URL || window.location.origin,
      });

      // Détecter un token d'invitation dans l'URL
      const hash = window.location.hash;
      if (hash && hash.includes('invite_token')) {
        setTimeout(() => {
          netlifyIdentity.open();
        }, 500);
      }
    });
  }, []);

  return null;
}
