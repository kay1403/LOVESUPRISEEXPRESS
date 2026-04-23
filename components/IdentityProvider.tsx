'use client';

import { useEffect } from 'react';

let isInitialized = false;

export default function IdentityProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInitialized) return;

    const initIdentity = async () => {
      try {
        // Vérifier si le script est déjà chargé
        if (!document.querySelector('script[src*="netlify-identity-widget"]')) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Attendre que le widget soit disponible
        let attempts = 0;
        const waitForIdentity = () => {
          return new Promise((resolve) => {
            const interval = setInterval(() => {
              if ((window as any).netlifyIdentity) {
                clearInterval(interval);
                resolve(true);
              } else if (attempts++ > 100) {
                clearInterval(interval);
                resolve(false);
              }
            }, 50);
          });
        };

        await waitForIdentity();
        
        const netlifyIdentity = (window as any).netlifyIdentity;
        if (netlifyIdentity && !netlifyIdentity._initialized) {
          netlifyIdentity.init({
            APIUrl: process.env.NEXT_PUBLIC_NETLIFY_URL || window.location.origin,
          });
          netlifyIdentity._initialized = true;
          console.log('✅ Netlify Identity initialisé');
        }

        // Gestion de l'invitation
        const hash = window.location.hash;
        if (hash && hash.includes('invite_token')) {
          setTimeout(() => {
            netlifyIdentity?.open();
          }, 500);
        }
        
        isInitialized = true;
      } catch (error) {
        console.error('Erreur chargement Netlify Identity:', error);
      }
    };

    initIdentity();
  }, []);

  return null;
}
