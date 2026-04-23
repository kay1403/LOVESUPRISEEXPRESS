'use client';

import { AdminAuthGuard, useNetlifyAuth } from './AdminIdentity';
import { Heart } from 'lucide-react';

function AdminHeader() {
  const { user, logout } = useNetlifyAuth();

  if (!user) return null;

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-dark">LoveExpress Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <button
            onClick={logout}
            className="text-gray-500 hover:text-red-500 text-sm transition"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        {children}
      </div>
    </AdminAuthGuard>
  );
}
