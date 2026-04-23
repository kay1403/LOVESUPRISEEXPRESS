'use client';

import { useEffect } from 'react';

export default function IdentityProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadIdentityWidget = () => {
      return new Promise((resolve, reject) => {
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
        
        const netlifyIdentity = (window as any).netlifyIdentity;
        if (netlifyIdentity) {
          netlifyIdentity.init({
            APIUrl: process.env.NEXT_PUBLIC_NETLIFY_URL || window.location.origin,
          });

          const hash = window.location.hash;
          if (hash && hash.includes('invite_token')) {
            setTimeout(() => {
              netlifyIdentity.open();
            }, 500);
          }
        }
      } catch (error) {
        console.error('Erreur chargement Netlify Identity Widget:', error);
      }
    };

    initIdentity();
  }, []);

  return null;
}
