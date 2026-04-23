'use client';

import { useEffect } from 'react';

export default function IdentityProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('netlify-identity-widget').then((module) => {
        const netlifyIdentity = module.default || module;
        netlifyIdentity.init({
          APIUrl: process.env.NEXT_PUBLIC_NETLIFY_URL || window.location.origin,
        });
      });
    }
  }, []);

  return null;
}
