'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    netlifyIdentity: any;
  }
}

export function useNetlifyAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkIdentity = () => {
      if (window.netlifyIdentity) {
        const netlifyIdentity = window.netlifyIdentity;
        
        if (!netlifyIdentity.init) {
          console.error('netlifyIdentity.init is not a function');
          setLoading(false);
          return;
        }

        netlifyIdentity.init({
          APIUrl: process.env.NEXT_PUBLIC_NETLIFY_URL || window.location.origin,
        });

        const handleLogin = (user: any) => {
          setUser(user);
          window.location.href = '/dashboard';
        };

        const handleLogout = () => {
          setUser(null);
          window.location.href = '/dashboard';
        };

        netlifyIdentity.on('login', handleLogin);
        netlifyIdentity.on('logout', handleLogout);

        const currentUser = netlifyIdentity.currentUser();
        if (currentUser) {
          setUser(currentUser);
        }
        setLoading(false);
      } else {
        setTimeout(checkIdentity, 50);
      }
    };

    checkIdentity();

    return () => {};
  }, []);

  const login = () => {
    if (typeof window !== 'undefined' && window.netlifyIdentity) {
      window.netlifyIdentity.open();
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined' && window.netlifyIdentity) {
      window.netlifyIdentity.logout();
    }
  };

  const getToken = () => {
    if (typeof window !== 'undefined' && window.netlifyIdentity) {
      const user = window.netlifyIdentity.currentUser();
      return user?.token?.access_token;
    }
    return null;
  };

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
          <button onClick={login} className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition w-full">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
