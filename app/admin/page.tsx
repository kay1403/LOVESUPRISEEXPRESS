'use client';

import dynamic from 'next/dynamic';

// Charger le composant admin dynamiquement (uniquement côté client)
const AdminDashboard = dynamic(
  () => import('@/components/AdminDashboard'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }
);

export default function AdminPage() {
  return <AdminDashboard />;
}
