'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Star, Users, Clock, Heart, Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogin = () => {
    if (adminKey === 'loveexpress2024') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Clé admin incorrecte');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersRes = await fetch('/api/get-orders', {
        headers: { 'Authorization': 'Bearer loveexpress2024' }
      });
      const ordersData = await ordersRes.json();
      if (ordersData.success) setOrders(ordersData.commandes || []);

      const avisRes = await fetch('/api/get-all-testimonials', {
        headers: { 'Authorization': 'Bearer loveexpress2024' }
      });
      const avisData = await avisRes.json();
      if (avisData.success) setTestimonials(avisData.avis || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const res = await fetch('/api/update-order-status', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer loveexpress2024'
      },
      body: JSON.stringify({ id, status })
    });
    if (res.ok) fetchData();
  };

  const moderateTestimonial = async (id: string, status: string) => {
    const res = await fetch('/api/moderate-testimonial', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer loveexpress2024'
      },
      body: JSON.stringify({ id, status })
    });
    if (res.ok) fetchData();
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-700' },
      delivered: { label: 'Livrée', color: 'bg-blue-100 text-blue-700' },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-700' }
    };
    return badges[status] || badges.pending;
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    pendingTestimonials: testimonials.filter(t => t.status === 'pending').length,
    totalRevenue: orders.reduce((sum, o) => sum + (parseInt(o.budget) || 0), 0)
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-dark">Dashboard LoveExpress</h1>
            <p className="text-gray-500 mt-2">Accès réservé à l'administration</p>
          </div>
          <input
            type="password"
            placeholder="Clé d'accès"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg mb-4"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="bg-primary text-white w-full py-3 rounded-lg font-semibold hover:bg-primary/90 transition">
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
            <Heart className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-dark">LoveExpress Admin</h1>
              <p className="text-xs text-gray-500">Gérez vos commandes et témoignages</p>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-gray-500 hover:text-red-500 text-sm">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Package className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">{stats.totalOrders}</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Commandes</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Clock className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold">{stats.pendingOrders}</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">En attente</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Star className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">{stats.pendingTestimonials}</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Avis à modérer</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Sparkles className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} RWF</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">CA total</p>
        </div>
      </div>

      <div className="px-6">
        <div className="flex gap-2 border-b">
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 font-medium transition ${activeTab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>
            Commandes ({stats.totalOrders})
          </button>
          <button onClick={() => setActiveTab('testimonials')} className={`px-4 py-2 font-medium transition ${activeTab === 'testimonials' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>
            Avis clients ({stats.pendingTestimonials} en attente)
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : activeTab === 'orders' ? (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                <p>Aucune commande pour le moment</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status).color}`}>
                          {getStatusBadge(order.status).label}
                        </span>
                      </div>
                      <p className="font-semibold">{order.clientName}</p>
                      <p className="text-sm text-gray-500">→ {order.destName}</p>
                      <p className="text-sm text-gray-500">{order.eventType} - {order.eventDate}</p>
                      <p className="text-primary font-bold mt-1">{parseInt(order.budget).toLocaleString()} RWF</p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-2 text-sm border rounded-lg bg-white"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                <p>Aucun témoignage pour le moment</p>
              </div>
            ) : (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {[...Array(testimonial.note || 5)].map((_, i) => (
                            <Star key={i} size={14} className="fill-accent text-accent" />
                          ))}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${testimonial.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {testimonial.status === 'published' ? 'Publié' : 'En attente'}
                        </span>
                      </div>
                      <p className="text-gray-700 italic">"{testimonial.message}"</p>
                      <p className="text-sm text-gray-500 mt-2">— {testimonial.nom || 'Anonyme'}</p>
                    </div>
                    {testimonial.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => moderateTestimonial(testimonial.id, 'published')} className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600">
                          Publier
                        </button>
                        <button onClick={() => moderateTestimonial(testimonial.id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600">
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
