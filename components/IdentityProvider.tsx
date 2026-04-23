'use client';

import { useEffect } from 'react';

export default function IdentityProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Vérifier si le script est déjà chargé
    const loadIdentityWidget = () => {
      return new Promise((resolve, reject) => {
        // Vérifier si déjà présent
        const existingScript = document.querySelector('script[src*="netlify-identity-widget"]');
        if (existingScript) {
          resolve(existingScript);
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initIdentity = async () => {
      try {
        await loadIdentityWidget();
        
        // Attendre que le widget soit complètement chargé
        const waitForIdentity = () => {
          return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
              if ((window as any).netlifyIdentity) {
                clearInterval(checkInterval);
                resolve(true);
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

        // Détecter un token d'invitation
        const hash = window.location.hash;
        if (hash && hash.includes('invite_token')) {
          setTimeout(() => {
            netlifyIdentity.open();
          }, 500);
        }
      } catch (error) {
        console.error('Erreur chargement Netlify Identity Widget:', error);
      }
    };

    initIdentity();
  }, []);

  return null;
}
