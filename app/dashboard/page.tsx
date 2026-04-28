'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetlifyAuth } from './AdminIdentity';
import { X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

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

// Fonction pour obtenir l'URL absolue des photos
const getImageUrl = (photoUrl: string | undefined): string => {
  if (!photoUrl) return '';
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://lovesupriseexpress.netlify.app';
  const path = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
  return `${baseUrl}${path}`;
};

// Composant pour tronquer les longs textes sur mobile
const TruncatedText = ({ text, maxLength = 100 }: { text: string; maxLength?: number }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > maxLength;
  
  if (!isLong) return <p className="text-gray-700 italic">"{text}"</p>;
  
  return (
    <div>
      <p className="text-gray-700 italic">
        "{expanded ? text : text.substring(0, maxLength)}"
        {!expanded && '...'}
      </p>
      <button 
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        className="text-primary text-xs mt-1 hover:underline"
      >
        {expanded ? 'Voir moins' : 'Voir plus'}
      </button>
    </div>
  );
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { getToken, user } = useNetlifyAuth();

  // Pagination pour les commandes
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const ordersTotalPages = Math.ceil(orders.length / ordersPerPage);
  const paginatedOrders = orders.slice(
    (ordersCurrentPage - 1) * ordersPerPage,
    ordersCurrentPage * ordersPerPage
  );

  // Pagination pour les avis
  const [avisCurrentPage, setAvisCurrentPage] = useState(1);
  const avisPerPage = 5;
  const avisTotalPages = Math.ceil(testimonials.length / avisPerPage);
  const paginatedTestimonials = testimonials.slice(
    (avisCurrentPage - 1) * avisPerPage,
    avisCurrentPage * avisPerPage
  );

  // Réinitialiser la page quand on change d'onglet
  useEffect(() => {
    setOrdersCurrentPage(1);
    setAvisCurrentPage(1);
  }, [activeTab]);

  const openPhotoModal = (photoUrl: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoUrl) {
      setSelectedPhoto(getImageUrl(photoUrl));
    }
  };

  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = await getToken();
    console.log('🔑 Token disponible?', !!token);
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
      console.log('🔍 Fetching orders...');
      const ordersRes = await authFetch('/functions/get-orders');
      console.log('📊 Orders Status:', ordersRes.status);
      
      if (!ordersRes.ok) {
        console.error('Orders HTTP error:', ordersRes.status);
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
        alert(`Avis ${status === 'published' ? 'publié' : status === 'rejected' ? 'rejeté' : 'restauré'} avec succès`);
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
    rejectedTestimonials: testimonials.filter(t => t.status === 'rejected').length,
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

  const getTestimonialStatusLabel = (status: string) => {
    switch(status) {
      case 'published': return 'Publié';
      case 'rejected': return 'Rejeté';
      default: return 'En attente';
    }
  };

  const getTestimonialStatusStyle = (status: string) => {
    switch(status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  // Composant de pagination réutilisable
  const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm text-gray-500">
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
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
      <div className="p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600 text-sm md:text-base">{error}</p>
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
    <div className="pb-8">
      {/* Stats Cards - Responsive: 2 colonnes sur mobile, 4 sur desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6">
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <p className="text-xl md:text-2xl font-bold">{stats.totalOrders}</p>
          <p className="text-gray-500 text-xs md:text-sm">Commandes totales</p>
        </div>
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <p className="text-xl md:text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          <p className="text-gray-500 text-xs md:text-sm">En attente</p>
        </div>
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <p className="text-xl md:text-2xl font-bold text-orange-500">{stats.pendingTestimonials}</p>
          <p className="text-gray-500 text-xs md:text-sm">Avis à modérer</p>
        </div>
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <p className="text-xl md:text-2xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} RWF</p>
          <p className="text-gray-500 text-xs md:text-sm">CA total</p>
        </div>
      </div>

      {/* Tabs - Responsive */}
      <div className="px-4 md:px-6">
        <div className="flex gap-2 border-b overflow-x-auto">
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`px-3 md:px-4 py-2 font-medium text-sm md:text-base whitespace-nowrap transition ${
              activeTab === 'orders' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Commandes ({stats.totalOrders})
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')} 
            className={`px-3 md:px-4 py-2 font-medium text-sm md:text-base whitespace-nowrap transition ${
              activeTab === 'testimonials' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Avis clients ({stats.pendingTestimonials} en attente)
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {activeTab === 'orders' ? (
          <>
            <div className="space-y-3 md:space-y-4">
              {paginatedOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                  Aucune commande pour le moment
                </div>
              ) : (
                paginatedOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm p-3 md:p-4 hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                      <div className="flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="font-semibold text-dark text-sm md:text-base">{order.clientName}</p>
                        <p className="text-xs md:text-sm text-gray-500 break-words">→ {order.destName}</p>
                        {order.destAddress && (
                          <p className="text-xs text-gray-400 mt-1 break-words">📍 {order.destAddress}</p>
                        )}
                        <p className="text-primary font-bold mt-2 text-sm md:text-base">
                          {Number(order.budget).toLocaleString()} RWF
                        </p>
                        {order.message && (
                          <TruncatedText text={order.message} maxLength={80} />
                        )}
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-auto"
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
            <Pagination 
              currentPage={ordersCurrentPage}
              totalPages={ordersTotalPages}
              onPageChange={setOrdersCurrentPage}
            />
          </>
        ) : (
          <>
            <div className="space-y-3 md:space-y-4">
              {paginatedTestimonials.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                  Aucun témoignage pour le moment
                </div>
              ) : (
                paginatedTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white rounded-xl shadow-sm p-3 md:p-4 hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                      <div className="flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div className="flex gap-0.5">
                            {[...Array(testimonial.note || 5)].map((_, i) => (
                              <span key={i} className="text-accent text-sm md:text-lg">★</span>
                            ))}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTestimonialStatusStyle(testimonial.status)}`}>
                            {getTestimonialStatusLabel(testimonial.status)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(testimonial.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        
                        {testimonial.photoUrl && (
                          <div className="mb-2 relative group inline-block">
                            <img 
                              src={getImageUrl(testimonial.photoUrl)} 
                              alt={`Photo de ${testimonial.nom}`}
                              className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition"
                              onClick={(e) => openPhotoModal(testimonial.photoUrl, e)}
                            />
                            <button
                              onClick={(e) => openPhotoModal(testimonial.photoUrl, e)}
                              className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                            >
                              <Maximize2 size={14} className="text-white" />
                            </button>
                          </div>
                        )}
                        
                        <TruncatedText text={testimonial.message} maxLength={100} />
                        <p className="text-xs md:text-sm text-gray-500 mt-2">— {testimonial.nom || 'Anonyme'}</p>
                      </div>
                      
                      <div className="flex gap-2 w-full md:w-auto">
                        {testimonial.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => moderateTestimonial(testimonial.id, 'published')} 
                              className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm hover:bg-green-600 transition flex-1 md:flex-none"
                            >
                              ✓ Publier
                            </button>
                            <button 
                              onClick={() => moderateTestimonial(testimonial.id, 'rejected')} 
                              className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm hover:bg-red-600 transition flex-1 md:flex-none"
                            >
                              ✗ Rejeter
                            </button>
                          </>
                        )}
                        
                        {testimonial.status === 'published' && (
                          <button 
                            onClick={() => moderateTestimonial(testimonial.id, 'rejected')} 
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm hover:bg-red-600 transition w-full"
                          >
                            Retirer
                          </button>
                        )}
                        
                        {testimonial.status === 'rejected' && (
                          <button 
                            onClick={() => moderateTestimonial(testimonial.id, 'published')} 
                            className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm hover:bg-green-600 transition w-full"
                          >
                            Restaurer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Pagination 
              currentPage={avisCurrentPage}
              totalPages={avisTotalPages}
              onPageChange={setAvisCurrentPage}
            />
          </>
        )}
      </div>

      {/* Modal photo plein écran */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedPhoto} 
                alt="Photo agrandie" 
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition"
              >
                <X size={24} className="text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}