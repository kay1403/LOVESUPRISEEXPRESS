'use client';

import { useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { Heart } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialiser Netlify Identity
    netlifyIdentity.init({
      APIUrl: process.env.NEXT_PUBLIC_NETLIFY_URL || window.location.origin,
    });

    const handleLogin = (user: any) => {
      setUser(user);
      setLoading(false);
    };

    const handleLogout = () => {
      setUser(null);
      window.location.href = '/admin';
    };

    netlifyIdentity.on('login', handleLogin);
    netlifyIdentity.on('logout', handleLogout);

    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);

    return () => {
      netlifyIdentity.off('login', handleLogin);
      netlifyIdentity.off('logout', handleLogout);
    };
  }, []);

  const handleLoginClick = () => {
    netlifyIdentity.open();
  };

  // Récupérer le token JWT pour les appels API
  const getToken = () => {
    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      return currentUser.token?.access_token;
    }
    return null;
  };

  // Exposer le token globalement pour les appels fetch
  if (typeof window !== 'undefined') {
    (window as any).__getAdminToken = getToken;
  }

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
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-dark mb-2">Dashboard LoveExpress</h1>
          <p className="text-gray-500 mb-6">Connectez-vous avec votre email pour accéder à l'administration</p>
          <button
            onClick={handleLoginClick}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition w-full"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-dark">LoveExpress Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <button
              onClick={() => netlifyIdentity.logout()}
              className="text-gray-500 hover:text-red-500 text-sm transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
