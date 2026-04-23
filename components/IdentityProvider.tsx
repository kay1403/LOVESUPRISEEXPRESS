'use client';

import { useEffect } from 'react';

let isIdentityInitialized = false;

export default function IdentityProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isIdentityInitialized) return;

    const initIdentity = async () => {
      try {
        const module = await import('netlify-identity-widget');
        const netlifyIdentity = module.default || module;
        
        // Initialisation SANS l'option 'open' qui n'existe pas
        netlifyIdentity.init({
          APIUrl: process.env.NEXT_PUBLIC_NETLIFY_URL || window.location.origin,
        });
        
        (window as any).netlifyIdentity = netlifyIdentity;
        isIdentityInitialized = true;
        
        console.log('✅ Netlify Identity initialisé');
        
        // Gérer l'invitation automatique (l'invitation ouvre automatiquement la popup)
        const hash = window.location.hash;
        if (hash && hash.includes('invite_token')) {
          setTimeout(() => {
            netlifyIdentity.open();
          }, 500);
        }
        
      } catch (error) {
        console.error('Erreur chargement Netlify Identity:', error);
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initIdentity);
    } else {
      initIdentity();
    }
    
  }, []);
  
  return null;
}
