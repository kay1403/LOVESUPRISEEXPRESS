'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

declare global {
  interface Window {
    netlifyIdentity: any;
  }
}

export function useNetlifyAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  // Fonction pour récupérer l'utilisateur actuel
  const refreshUser = useCallback(() => {
    if (typeof window !== 'undefined' && window.netlifyIdentity) {
      const currentUser = window.netlifyIdentity.currentUser();
      if (isMounted.current) {
        setUser(currentUser);
      }
      return currentUser;
    }
    return null;
  }, []);

  // Initialisation et attente du widget
  useEffect(() => {
    if (typeof window === 'undefined') return;

    isMounted.current = true;

    const waitForIdentity = () => {
      // Si déjà disponible
      if (window.netlifyIdentity) {
        refreshUser();
        setLoading(false);
        return;
      }

      // Sinon, attendre
      let attempts = 0;
      const maxAttempts = 100; // 5 secondes max
      
      const interval = setInterval(() => {
        attempts++;
        if (window.netlifyIdentity) {
          clearInterval(interval);
          refreshUser();
          setLoading(false);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setLoading(false);
          console.warn('Netlify Identity non disponible');
        }
      }, 50);
      
      return () => clearInterval(interval);
    };

    const cleanup = waitForIdentity();
    return () => {
      isMounted.current = false;
      if (cleanup) cleanup();
    };
  }, [refreshUser]);

  // Écouter les événements login/logout
  useEffect(() => {
    if (typeof window === 'undefined' || !window.netlifyIdentity) return;

    const identity = window.netlifyIdentity;

    const handleLogin = (user: any) => {
      console.log('🔐 Login event', user?.email);
      if (isMounted.current) {
        setUser(user);
      }
      // Redirection après login SEULEMENT si pas déjà sur dashboard
      if (window.location.pathname !== '/dashboard') {
        window.location.href = '/dashboard';
      }
    };

    const handleLogout = () => {
      console.log('🚪 Logout event');
      if (isMounted.current) {
        setUser(null);
      }
      // Ne pas rediriger, rester sur la page pour voir le bouton "Se connecter"
    };

    identity.on('login', handleLogin);
    identity.on('logout', handleLogout);

    return () => {
      identity.off('login', handleLogin);
      identity.off('logout', handleLogout);
    };
  }, []);

  const login = useCallback(() => {
    const identity = window.netlifyIdentity;
    if (identity) {
      identity.open();
    }
  }, []);

  const logout = useCallback(() => {
    const identity = window.netlifyIdentity;
    if (identity) {
      identity.logout();
      // L'état sera mis à jour par l'événement 'logout'
    }
  }, []);

  const getToken = useCallback(() => {
    const identity = window.netlifyIdentity;
    if (identity) {
      const currentUser = identity.currentUser();
      return currentUser?.token?.access_token;
    }
    return null;
  }, []);

  return { user, loading, login, logout, getToken, refreshUser };
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, login } = useNetlifyAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-dark mb-2">Dashboard LoveExpress</h1>
          <p className="text-gray-500 mb-6">Connectez-vous avec votre email</p>
          <button 
            onClick={login} 
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition w-full"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
