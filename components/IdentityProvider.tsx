'use client';

import { useEffect } from 'react';

export default function IdentityProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Charger le script Netlify Identity Widget via CDN (plus fiable)
    const script = document.createElement('script');
    script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      const netlifyIdentity = window.netlifyIdentity;
      if (netlifyIdentity) {
        netlifyIdentity.init({
          APIUrl: process.env.NEXT_PUBLIC_NETLIFY_URL || window.location.origin,
        });

        // Détecter un token d'invitation
        const hash = window.location.hash;
        if (hash && hash.includes('invite_token')) {
          setTimeout(() => {
            netlifyIdentity.open();
          }, 500);
        }
      }
    };

    return () => {
      // Nettoyage non nécessaire pour le script
    };
  }, []);

  return null;
}
