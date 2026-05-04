'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetlifyAuth } from './AdminIdentity';
import { 
  X, Maximize2, ChevronLeft, ChevronRight, Eye, MapPin, 
  Calendar as CalendarIcon, Clock, Phone, Mail, Gift, 
  MessageCircle, User, Package, Heart, Sparkles, Globe, 
  Flower2, Baby, Coffee, AlertCircle, Truck, CheckCircle, 
  XCircle, Clock as ClockIcon, PartyPopper, Trash2
} from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  destName: string;
  destPhone: string;
  destAddress: string;
  destAge: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  selectedServices: number[];
  selectedPacks: number[];
  selectedBaskets: { id: number; version: 'standard' | 'premium' }[];
  budget: number;
  confirmedAmount?: number;
  originalBudget?: number;
  totalPrice?: number;
  deliveryMethod: 'delivery' | 'pickup';
  message: string;
  specialInstructions: string;
  isDiscreet: boolean;
  needsPersonPresent: boolean;
  additionalNotes: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
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

// Données pour l'affichage des services (identique au formulaire)
const servicesData = [
  { id: 1, name: 'Party Decoration', icon: PartyPopper, packs: [
    { id: 1, name: 'Pack Premier Frisson', price: 60000 },
    { id: 2, name: 'Pack Love XL', price: 100000 },
    { id: 3, name: 'Pack ROYAL SURPRISE', price: 200000 }
  ] },
  { id: 2, name: 'Surprise Planner', icon: Sparkles, price: 200000 },
  { id: 3, name: 'Custom Website', icon: Globe, priceMin: 25000, priceMax: 45000 },
  { id: 4, name: 'Flower Bouquet', icon: Flower2, price: 15000 }
];

const basketsData = [
  { id: 1, name: 'Birthday', icon: Gift, standard: 15000, premium: 80000 },
  { id: 2, name: 'Romantic', icon: Heart, standard: 40000, premium: 50000 },
  { id: 3, name: 'New Baby', icon: Baby, standard: 40000, premium: 80000 },
  { id: 4, name: 'Gourmet', icon: Coffee, standard: 20000, premium: 70000 },
  { id: 5, name: 'Wellness', icon: Flower2, standard: 50000, premium: 100000 }
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
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

  const openOrderDetails = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrderDetails(order);
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
      let confirmedAmount = null;
      if (status === 'confirmed') {
        const amount = prompt('Entrez le montant confirmé pour cette commande (en RWF) :');
        if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
          confirmedAmount = Number(amount);
        } else if (amount !== null) {
          alert('Veuillez entrer un montant valide');
          return;
        }
      }
      
      const res = await authFetch('/functions/update-order-status', {
        method: 'POST',
        body: JSON.stringify({ id, status, confirmedAmount })
      });
      if (res.ok) {
        await fetchData();
        if (status === 'confirmed' && confirmedAmount) {
          alert(`Commande confirmée avec le montant de ${confirmedAmount.toLocaleString()} RWF`);
        }
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
        alert(`Avis ${status === 'published' ? 'publié' : 'rejeté'} avec succès`);
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

  const deleteTestimonial = async (id: string) => {
    if (confirm('⚠️ Attention : Cette action est IRRÉVERSIBLE. Voulez-vous vraiment supprimer définitivement cet avis ?')) {
      try {
        const res = await authFetch('/functions/delete-testimonial', {
          method: 'DELETE',
          body: JSON.stringify({ id })
        });
        if (res.ok) {
          await fetchData();
          alert('Avis supprimé définitivement');
        } else {
          const error = await res.json();
          console.error('Erreur suppression:', error);
          alert('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
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
    totalRevenue: orders.reduce((sum, o) => {
      if (o.status === 'confirmed' && o.confirmedAmount) return sum + (Number(o.confirmedAmount) || 0);
      if (o.status === 'cancelled') return sum;
      return sum + (Number(o.budget) || 0);
    }, 0)
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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <ClockIcon size={16} className="text-yellow-600" />;
      case 'confirmed': return <CheckCircle size={16} className="text-green-600" />;
      case 'delivered': return <Truck size={16} className="text-blue-600" />;
      case 'cancelled': return <XCircle size={16} className="text-red-600" />;
      default: return <ClockIcon size={16} />;
    }
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

  // Fonctions pour formater les sélections
  const getSelectedPacksList = (selectedPacks: number[]) => {
    const packs = servicesData[0]?.packs || [];
    return selectedPacks.map(packId => packs.find(p => p.id === packId)).filter(Boolean);
  };

  const getSelectedServicesList = (selectedServices: number[]) => {
    return selectedServices.map(serviceId => servicesData.find(s => s.id === serviceId)).filter(Boolean);
  };

  const getSelectedBasketsList = (selectedBaskets: { id: number; version: 'standard' | 'premium' }[]) => {
    return selectedBaskets.map(basket => ({
      ...basketsData.find(b => b.id === basket.id),
      version: basket.version
    })).filter(Boolean);
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

  // Composant Modal Détails Commande - Version COMPLÈTE (A à Z)
  const OrderDetailsModal = ({ order, onClose }: { order: Order | null; onClose: () => void }) => {
    if (!order) return null;

    const selectedPacks = getSelectedPacksList(order.selectedPacks || []);
    const selectedServices = getSelectedServicesList(order.selectedServices || []);
    const selectedBaskets = getSelectedBasketsList(order.selectedBaskets || []);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* En-tête avec ID et statut */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-5 md:p-6 sticky top-0 z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-80">Commande</p>
                <h2 className="text-xl md:text-2xl font-bold font-mono break-all">{order.id}</h2>
              </div>
              <button onClick={onClose} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
                <X size={20} className="text-white" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)} bg-opacity-20`}>
                {getStatusIcon(order.status)}
                {getStatusLabel(order.status)}
              </span>
              <span className="text-xs opacity-70">
                {new Date(order.createdAt).toLocaleString('fr-FR')}
              </span>
            </div>
          </div>

          <div className="p-5 md:p-6 space-y-6">
            {/* ==================== SECTION 1: INFORMATIONS CLIENT ==================== */}
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-4 border-l-4 border-blue-500">
              <h3 className="font-semibold text-dark flex items-center gap-2 mb-4 text-lg">
                <User size={20} className="text-blue-500" />
                Informations client
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <p className="flex items-center gap-2"><User size={16} className="text-gray-400" /><span className="font-medium">{order.clientName || 'Non renseigné'}</span></p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-gray-400" /><a href={`tel:${order.clientPhone}`} className="text-primary hover:underline">{order.clientPhone || 'Non renseigné'}</a></p>
                <p className="flex items-center gap-2"><Mail size={16} className="text-gray-400" /><span>{order.clientEmail || 'Non renseigné'}</span></p>
              </div>
            </div>

            {/* ==================== SECTION 2: INFORMATIONS DESTINATAIRE ==================== */}
            <div className="bg-gradient-to-r from-purple-50 to-white rounded-xl p-4 border-l-4 border-purple-500">
              <h3 className="font-semibold text-dark flex items-center gap-2 mb-4 text-lg">
                <Gift size={20} className="text-purple-500" />
                Destinataire
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <p className="flex items-center gap-2"><User size={16} className="text-gray-400" /><span className="font-medium">{order.destName || 'Non renseigné'}</span></p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-gray-400" /><span>{order.destPhone || 'Non renseigné'}</span></p>
                <p className="flex items-center gap-2 md:col-span-2"><MapPin size={16} className="text-gray-400" /><span>{order.destAddress || 'Non renseignée'}</span></p>
                {order.destAge && <p className="flex items-center gap-2"><CalendarIcon size={16} className="text-gray-400" /><span>Âge: {order.destAge} ans</span></p>}
              </div>
            </div>

            {/* ==================== SECTION 3: ÉVÉNEMENT ==================== */}
            <div className="bg-gradient-to-r from-pink-50 to-white rounded-xl p-4 border-l-4 border-pink-500">
              <h3 className="font-semibold text-dark flex items-center gap-2 mb-4 text-lg">
                <CalendarIcon size={20} className="text-pink-500" />
                Détails de l'événement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <p className="flex items-center gap-2"><CalendarIcon size={16} className="text-gray-400" /><span><strong>Type:</strong> {order.eventType || 'Non spécifié'}</span></p>
                <p className="flex items-center gap-2"><CalendarIcon size={16} className="text-gray-400" /><span><strong>Date:</strong> {order.eventDate ? new Date(order.eventDate).toLocaleDateString('fr-FR') : 'Non renseignée'}</span></p>
                <p className="flex items-center gap-2"><Clock size={16} className="text-gray-400" /><span><strong>Heure:</strong> {order.eventTime || 'Non renseignée'}</span></p>
                <p className="flex items-center gap-2 md:col-span-2"><MapPin size={16} className="text-gray-400" /><span><strong>Lieu:</strong> {order.eventLocation || 'Non renseigné'}</span></p>
              </div>
            </div>

            {/* ==================== SECTION 4: SERVICES & PRODUITS ==================== */}
            <div className="bg-gradient-to-r from-green-50 to-white rounded-xl p-4 border-l-4 border-green-500">
              <h3 className="font-semibold text-dark flex items-center gap-2 mb-4 text-lg">
                <Package size={20} className="text-green-500" />
                Services & Produits commandés
              </h3>
              
              {/* Packs Party Decoration */}
              {selectedPacks.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium text-dark flex items-center gap-2 mb-2"><PartyPopper size={16} className="text-primary" />Packs Party Decoration</p>
                  <ul className="space-y-1 ml-6">
                    {selectedPacks.map((pack, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span>{pack?.name}</span>
                        <span className="font-bold text-primary">{pack?.price?.toLocaleString()} RWF</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Autres services */}
              {selectedServices.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium text-dark flex items-center gap-2 mb-2"><Sparkles size={16} className="text-primary" />Services additionnels</p>
                  <ul className="space-y-1 ml-6">
                    {selectedServices.map((service, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span>{service?.name}</span>
                        <span className="font-bold text-primary">
                          {service?.price 
                            ? `${service.price.toLocaleString()} RWF` 
                            : service?.priceMin ? `${service.priceMin.toLocaleString()} - ${service.priceMax?.toLocaleString()} RWF` : 'Sur devis'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Paniers cadeaux */}
              {selectedBaskets.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium text-dark flex items-center gap-2 mb-2"><Gift size={16} className="text-primary" />Paniers cadeaux</p>
                  <ul className="space-y-1 ml-6">
                    {selectedBaskets.map((basket, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span>{basket?.name} ({basket?.version === 'standard' ? 'Standard' : 'Premium'})</span>
                        <span className="font-bold text-primary">
                          {(basket?.version === 'standard' ? basket?.standard : basket?.premium)?.toLocaleString()} RWF
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedPacks.length === 0 && selectedServices.length === 0 && selectedBaskets.length === 0 && (
                <p className="text-gray-500 italic text-sm">Aucun service ou produit sélectionné</p>
              )}
            </div>

            {/* ==================== SECTION 5: LIVRAISON & BUDGET ==================== */}
            <div className="bg-gradient-to-r from-orange-50 to-white rounded-xl p-4 border-l-4 border-orange-500">
              <h3 className="font-semibold text-dark flex items-center gap-2 mb-4 text-lg">
                <Truck size={20} className="text-orange-500" />
                Livraison & Budget
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <p className="flex items-center gap-2"><Truck size={16} className="text-gray-400" /><span><strong>Mode:</strong> {order.deliveryMethod === 'delivery' ? 'Livraison à domicile (+5 000 RWF)' : 'Retrait au bureau'}</span></p>
                <div>
                  <p className="flex items-center gap-2"><AlertCircle size={16} className="text-gray-400" /><span><strong>Budget:</strong> <span className="font-bold text-primary text-lg">
                    {order.status === 'confirmed' && order.confirmedAmount 
                      ? `${order.confirmedAmount.toLocaleString()} RWF`
                      : order.status === 'cancelled'
                      ? <span className="line-through text-gray-400">{order.budget?.toLocaleString()} RWF</span>
                      : `${order.budget?.toLocaleString()} RWF`}
                  </span></span></p>
                  {order.status === 'confirmed' && order.confirmedAmount && order.originalBudget && order.originalBudget !== order.confirmedAmount && (
                    <p className="text-xs text-gray-400 ml-6">Initial: {order.originalBudget.toLocaleString()} RWF</p>
                  )}
                </div>
              </div>
            </div>

            {/* ==================== SECTION 6: MESSAGES ==================== */}
            {(order.message || order.specialInstructions || order.additionalNotes) && (
              <div className="bg-gradient-to-r from-yellow-50 to-white rounded-xl p-4 border-l-4 border-yellow-500">
                <h3 className="font-semibold text-dark flex items-center gap-2 mb-4 text-lg">
                  <MessageCircle size={20} className="text-yellow-500" />
                  Messages & Instructions
                </h3>
                {order.message && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">Message sur la carte</p>
                    <p className="italic text-gray-700">"{order.message}"</p>
                  </div>
                )}
                {order.specialInstructions && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">Instructions spéciales</p>
                    <p className="text-gray-700">{order.specialInstructions}</p>
                  </div>
                )}
                {order.additionalNotes && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Notes supplémentaires</p>
                    <p className="text-gray-700">{order.additionalNotes}</p>
                  </div>
                )}
              </div>
            )}

            {/* ==================== SECTION 7: OPTIONS SPÉCIALES ==================== */}
            {(order.isDiscreet || order.needsPersonPresent) && (
              <div className="bg-gradient-to-r from-indigo-50 to-white rounded-xl p-4 border-l-4 border-indigo-500">
                <h3 className="font-semibold text-dark flex items-center gap-2 mb-3 text-lg">
                  <Heart size={20} className="text-indigo-500" />
                  Options spéciales
                </h3>
                <div className="space-y-2">
                  {order.isDiscreet && (
                    <p className="flex items-center gap-2 text-sm"><CheckCircle size={14} className="text-green-500" />Surprise discrète (ne pas révéler l'expéditeur)</p>
                  )}
                  {order.needsPersonPresent && (
                    <p className="flex items-center gap-2 text-sm"><CheckCircle size={14} className="text-green-500" />Le destinataire doit être présent lors de la livraison</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
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
      {/* Stats Cards */}
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

      {/* Tabs */}
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
                        <div className="flex flex-col mt-2">
                          <p className="text-primary font-bold text-sm md:text-base">
                            {order.status === 'confirmed' && order.confirmedAmount 
                              ? `${order.confirmedAmount.toLocaleString()} RWF` 
                              : order.status === 'cancelled'
                              ? <span className="line-through text-gray-400">{order.budget?.toLocaleString()} RWF</span>
                              : `${order.budget?.toLocaleString()} RWF`}
                          </p>
                          {order.status === 'confirmed' && order.confirmedAmount && order.originalBudget && order.originalBudget !== order.confirmedAmount && (
                            <p className="text-xs text-gray-400">Initial: {order.originalBudget.toLocaleString()} RWF</p>
                          )}
                        </div>
                        {order.message && (
                          <TruncatedText text={order.message} maxLength={80} />
                        )}
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={(e) => openOrderDetails(order, e)}
                          className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs md:text-sm hover:bg-primary hover:text-white transition flex items-center gap-1"
                        >
                          <Eye size={14} /> Voir détails
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="pending">📋 En attente</option>
                          <option value="confirmed">✅ Confirmée</option>
                          <option value="delivered">🚚 Livrée</option>
                          <option value="cancelled">❌ Annulée</option>
                        </select>
                      </div>
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
                      
                      <div className="flex gap-2 w-full md:w-auto flex-wrap">
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
                            className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm hover:bg-orange-600 transition flex-1"
                          >
                            Retirer
                          </button>
                        )}
                        
                        {testimonial.status === 'rejected' && (
                          <button 
                            onClick={() => moderateTestimonial(testimonial.id, 'published')} 
                            className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm hover:bg-green-600 transition flex-1"
                          >
                            Restaurer
                          </button>
                        )}
                        
                        {/* Bouton Supprimer définitivement - visible pour tous les statuts */}
                        <button 
                          onClick={() => deleteTestimonial(testimonial.id)} 
                          className="bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm hover:bg-red-800 transition flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Supprimer
                        </button>
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

      {/* Modal détails commande COMPLET */}
      <AnimatePresence>
        {selectedOrderDetails && (
          <OrderDetailsModal 
            order={selectedOrderDetails} 
            onClose={() => setSelectedOrderDetails(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}