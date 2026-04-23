'use client';

import { useEffect } from 'react';

// Singleton pour éviter les doubles initialisations
let isIdentityInitialized = false;
let identityListenersAttached = false;

export default function IdentityProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initIdentity = async () => {
      // Éviter les doubles initialisations
      if (isIdentityInitialized) return;
      
      try {
        // Charger le module
        const module = await import('netlify-identity-widget');
        const netlifyIdentity = module.default || module;
        
        // Initialiser UNE SEULE FOIS
        netlifyIdentity.init({
          APIUrl: process.env.NEXT_PUBLIC_NETLIFY_URL || window.location.origin,
        });
        
        // Stocker globalement pour les autres composants
        (window as any).netlifyIdentity = netlifyIdentity;
        isIdentityInitialized = true;
        
        console.log('✅ Netlify Identity initialisé');
        
        // Gérer l'invitation automatique
        const checkInvite = () => {
          const hash = window.location.hash;
          if (hash && hash.includes('invite_token')) {
            setTimeout(() => {
              netlifyIdentity.open();
            }, 500);
          }
        };
        
        checkInvite();
        
        // Écouter les changements de hash
        window.addEventListener('hashchange', checkInvite);
        
      } catch (error) {
        console.error('Erreur chargement Netlify Identity:', error);
      }
    };
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initIdentity);
    } else {
      initIdentity();
    }
    
  }, []);
  
  return null;
}
