'use client';

import { useState, useEffect } from 'react';
import { useNetlifyAuth } from './AdminIdentity';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useNetlifyAuth();

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersRes = await authFetch('/api/get-orders');
      const ordersData = await ordersRes.json();
      if (ordersData.success) setOrders(ordersData.commandes || []);

      const avisRes = await authFetch('/api/get-all-testimonials');
      const avisData = await avisRes.json();
      if (avisData.success) setTestimonials(avisData.avis || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    const res = await authFetch('/api/update-order-status', {
      method: 'POST',
      body: JSON.stringify({ id, status })
    });
    if (res.ok) fetchData();
  };

  const moderateTestimonial = async (id: string, status: string) => {
    const res = await authFetch('/api/moderate-testimonial', {
      method: 'POST',
      body: JSON.stringify({ id, status })
    });
    if (res.ok) fetchData();
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      delivered: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return badges[status] || badges.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || 'En attente';
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    pendingTestimonials: testimonials.filter(t => t.status === 'pending').length,
    totalRevenue: orders.reduce((sum, o) => sum + (parseInt(o.budget) || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
          <p className="text-gray-500 text-sm">Commandes</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          <p className="text-gray-500 text-sm">En attente</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-orange-500">{stats.pendingTestimonials}</p>
          <p className="text-gray-500 text-sm">Avis à modérer</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} RWF</p>
          <p className="text-gray-500 text-sm">CA total</p>
        </div>
      </div>

      <div className="px-6">
        <div className="flex gap-2 border-b">
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>
            Commandes ({stats.totalOrders})
          </button>
          <button onClick={() => setActiveTab('testimonials')} className={`px-4 py-2 font-medium ${activeTab === 'testimonials' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>
            Avis clients ({stats.pendingTestimonials} en attente)
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'orders' ? (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl">Aucune commande</div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <p className="font-semibold mt-2">{order.clientName}</p>
                      <p className="text-sm text-gray-500">→ {order.destName}</p>
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
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl">Aucun témoignage</div>
            ) : (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {[...Array(testimonial.note || 5)].map((_, i) => (
                            <span key={i} className="text-accent">★</span>
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
