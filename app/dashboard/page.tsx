'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNetlifyAuth } from './AdminIdentity';

interface Order {
  id: string;
  clientName: string;
  destName: string;
  destAddress: string;
  budget: number;
  totalPrice?: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
  eventDate: string;
  eventType: string;
  message?: string;
}

interface TestimonialItem {
  id: string;
  nom: string;
  note: number;
  message: string;
  photoUrl?: string;
  status: 'pending' | 'published' | 'rejected';
  createdAt: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken, user } = useNetlifyAuth();

  // ✅ useCallback pour stabiliser authFetch
  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = await getToken();
    console.log('🔑 Token disponible?', !!token, token ? token.substring(0, 20) + '...' : 'NULL');
    
    if (!token) {
      console.warn('⚠️ Appel sans token — sera rejeté 401');
    }
    
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  }, [getToken]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Récupération des commandes
      console.log('🔍 Fetching orders...');
      const ordersRes = await authFetch('/functions/get-orders');
      console.log('📊 Orders Status:', ordersRes.status);
      
      if (!ordersRes.ok) {
        console.error('Orders HTTP error:', ordersRes.status);
        const errorText = await ordersRes.text();
        console.error('Orders error body:', errorText);
        if (ordersRes.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
          setLoading(false);
          return;
        }
      } else {
        const ordersData = await ordersRes.json();
        console.log('📦 Orders response:', ordersData);
        
        if (ordersData.success) {
          setOrders(ordersData.commandes || []);
        } else {
          console.error('Orders error:', ordersData.error);
        }
      }

      // 2. Récupération des avis
      console.log('🔍 Fetching testimonials...');
      const avisRes = await authFetch('/functions/get-all-testimonials');
      console.log('📊 Avis Status:', avisRes.status);
      
      if (!avisRes.ok) {
        console.error('Avis HTTP error:', avisRes.status);
        if (avisRes.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
          setLoading(false);
          return;
        }
      } else {
        const avisData = await avisRes.json();
        console.log('⭐ Testimonials response:', avisData);
        
        if (avisData.success) {
          setTestimonials(avisData.avis || []);
        } else {
          console.error('Testimonials error:', avisData.error);
        }
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
      setError('Erreur de chargement des données. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  // ✅ délai pour laisser identity s'initialiser après login
  useEffect(() => {
    if (!user) return;
    
    console.log('👤 User connecté:', user.email);
    
    const timer = setTimeout(() => {
      fetchData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user, fetchData]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await authFetch('/functions/update-order-status', {
        method: 'POST',
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        await fetchData();
      } else {
        const error = await res.json();
        console.error('Erreur mise à jour:', error);
        alert('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const moderateTestimonial = async (id: string, status: string) => {
    try {
      const res = await authFetch('/functions/moderate-testimonial', {
        method: 'POST',
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        await fetchData();
      } else {
        const error = await res.json();
        console.error('Erreur modération:', error);
        alert('Erreur lors de la modération');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modération');
    }
  };

  const stats = useMemo(() => ({
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    confirmedOrders: orders.filter(o => o.status === 'confirmed').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
    pendingTestimonials: testimonials.filter(t => t.status === 'pending').length,
    publishedTestimonials: testimonials.filter(t => t.status === 'published').length,
    totalRevenue: orders.reduce((sum, o) => sum + (Number(o.budget) || 0), 0)
  }), [orders, testimonials]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => {
              if (user) fetchData();
              else window.location.href = '/dashboard';
            }} 
            className="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
          <p className="text-gray-500 text-sm">Commandes totales</p>
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

      {/* Tabs */}
      <div className="px-6">
        <div className="flex gap-2 border-b">
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'orders' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Commandes ({stats.totalOrders})
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')} 
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'testimonials' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Avis clients ({stats.pendingTestimonials} en attente)
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'orders' ? (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                Aucune commande pour le moment
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="font-semibold text-dark">{order.clientName}</p>
                      <p className="text-sm text-gray-500">→ {order.destName}</p>
                      {order.destAddress && (
                        <p className="text-xs text-gray-400 mt-1">📍 {order.destAddress}</p>
                      )}
                      <p className="text-primary font-bold mt-2">
                        {Number(order.budget).toLocaleString()} RWF
                      </p>
                      {order.message && (
                        <p className="text-sm text-gray-600 italic mt-2">"{order.message}"</p>
                      )}
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="pending">📋 En attente</option>
                      <option value="confirmed">✅ Confirmée</option>
                      <option value="delivered">🚚 Livrée</option>
                      <option value="cancelled">❌ Annulée</option>
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
                Aucun témoignage pour le moment
              </div>
            ) : (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="flex gap-0.5">
                          {[...Array(testimonial.note || 5)].map((_, i) => (
                            <span key={i} className="text-accent text-lg">★</span>
                          ))}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          testimonial.status === 'published' 
                            ? 'bg-green-100 text-green-700' 
                            : testimonial.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {testimonial.status === 'published' 
                            ? '✓ Publié' 
                            : testimonial.status === 'rejected'
                            ? '✗ Rejeté'
                            : '⏳ En attente'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(testimonial.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      {/* Aperçu photo */}
                      {testimonial.photoUrl && (
                        <div className="mb-2">
                          <img 
                            src={testimonial.photoUrl} 
                            alt="Photo du témoignage" 
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      )}
                      
                      <p className="text-gray-700 italic">"{testimonial.message}"</p>
                      <p className="text-sm text-gray-500 mt-2">— {testimonial.nom || 'Anonyme'}</p>
                    </div>
                    
                    {testimonial.status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => moderateTestimonial(testimonial.id, 'published')} 
                          className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 transition"
                        >
                          ✓ Publier
                        </button>
                        <button 
                          onClick={() => moderateTestimonial(testimonial.id, 'rejected')} 
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
                        >
                          ✗ Rejeter
                        </button>
                      </div>
                    )}
                    
                    {testimonial.status === 'published' && (
                      <button 
                        onClick={() => moderateTestimonial(testimonial.id, 'rejected')} 
                        className="bg-gray-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-600 transition"
                      >
                        Retirer
                      </button>
                    )}
                    
                    {testimonial.status === 'rejected' && (
                      <button 
                        onClick={() => moderateTestimonial(testimonial.id, 'published')} 
                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 transition"
                      >
                        Restaurer
                      </button>
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