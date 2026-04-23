'use client';

import { useEffect, useState, useCallback } from 'react';

declare global {
  interface Window {
    netlifyIdentity: any;
  }
}

export function useNetlifyAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [identityReady, setIdentityReady] = useState(false);

  // Vérifier la disponibilité du widget
  useEffect(() => {
    const checkIdentity = () => {
      if ((window as any).netlifyIdentity) {
        setIdentityReady(true);
        setLoading(false);
        return true;
      }
      return false;
    };
    
    // Vérifier immédiatement
    if (checkIdentity()) return;
    
    // Sinon, attendre avec un court délai
    const interval = setInterval(() => {
      if (checkIdentity()) {
        clearInterval(interval);
      }
    }, 50);
    
    // Timeout de sécurité
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
      console.warn('Netlify Identity non disponible après délai');
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Récupérer l'utilisateur et écouter les événements
  useEffect(() => {
    if (!identityReady) return;
    
    const identity = (window as any).netlifyIdentity;
    if (!identity) return;
    
    // Récupérer l'utilisateur actuel
    const currentUser = identity.currentUser();
    setUser(currentUser);
    
    // Gestionnaire de login
    const handleLogin = (user: any) => {
      console.log('🔐 Login event');
      setUser(user);
      // Rediriger vers dashboard après login
      if (window.location.pathname !== '/dashboard') {
        window.location.href = '/dashboard';
      }
    };
    
    // Gestionnaire de logout
    const handleLogout = () => {
      console.log('🚪 Logout event');
      setUser(null);
    };
    
    identity.on('login', handleLogin);
    identity.on('logout', handleLogout);
    
    return () => {
      identity.off('login', handleLogin);
      identity.off('logout', handleLogout);
    };
  }, [identityReady]);

  const login = useCallback(() => {
    const identity = (window as any).netlifyIdentity;
    if (identity) {
      identity.open();
    }
  }, []);

  const logout = useCallback(() => {
    const identity = (window as any).netlifyIdentity;
    if (identity) {
      identity.logout();
      setUser(null);
    }
  }, []);

  const getToken = useCallback(() => {
    const identity = (window as any).netlifyIdentity;
    if (identity) {
      const currentUser = identity.currentUser();
      return currentUser?.token?.access_token;
    }
    return null;
  }, []);

  return { user, loading, login, logout, getToken };
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
