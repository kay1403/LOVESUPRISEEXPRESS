const { getStore: getNetlifyStore } = require('@netlify/blobs');

// Récupérer l'ID du site depuis les variables d'environnement
const SITE_ID = process.env.NETLIFY_SITE_ID;
if (!SITE_ID && process.env.NODE_ENV === 'production') {
  throw new Error('NETLIFY_SITE_ID environment variable is required in production');
}

// Cache des stores pour éviter appels réseau inutiles
const storeCache = new Map();

async function getStore(storeName) {
  // Vérifier le cache
  if (storeCache.has(storeName)) {
    console.log(`🔍 Store ${storeName} (caché)`);
    return storeCache.get(storeName);
  }

  console.log(`🔍 Initialisation store: ${storeName}`);

  // En production, on utilise les variables d'environnement (pas d'auto-détection hasardeuse)
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NETLIFY_AUTH_TOKEN || !SITE_ID) {
      throw new Error(`NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID are required in production for store ${storeName}`);
    }
    const store = getNetlifyStore({
      name: storeName,
      siteID: SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN
    });
    // Test rapide pour valider la connexion
    await store.list({ limit: 1 });
    console.log(`✅ Store ${storeName} accessible (manuel avec env)`);
    storeCache.set(storeName, store);
    return store;
  }

  // En développement, auto-détection (pas besoin de token)
  try {
    const store = getNetlifyStore({ name: storeName });
    await store.list({ limit: 1 });
    console.log(`✅ Store ${storeName} accessible (auto-détection en dev)`);
    storeCache.set(storeName, store);
    return store;
  } catch (autoError) {
    console.error(`❌ Erreur auto-détection en dev : ${autoError.message}`);
    throw autoError;
  }
}

function generateId(prefix) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

async function saveCommand(data) {
  console.log('💾 saveCommand');
  const store = await getStore('commandes');
  const id = generateId('CMD');

  const commande = {
    id,
    clientName: data.clientName || 'Client inconnu',
    clientPhone: data.clientPhone || 'Non renseigné',
    clientEmail: data.clientEmail || '',
    destName: data.destName || 'Destinataire inconnu',
    destPhone: data.destPhone || '',
    destAddress: data.destAddress || 'Adresse non renseignée',
    destAge: data.destAge || '',
    eventType: data.eventType || 'Autre',
    eventDate: data.eventDate || new Date().toISOString().split('T')[0],
    eventTime: data.eventTime || '12:00',
    eventLocation: data.eventLocation || 'Kigali',
    selectedServices: data.selectedServices || [],
    selectedPacks: data.selectedPacks || [],
    selectedBaskets: data.selectedBaskets || [],
    budget: data.budget || data.totalPrice || 0,
    confirmedAmount: null,
    originalBudget: null,
    deliveryMethod: data.deliveryMethod || 'delivery',
    message: data.message || '',
    specialInstructions: data.specialInstructions || '',
    isDiscreet: data.isDiscreet || false,
    needsPersonPresent: data.needsPersonPresent || false,
    additionalNotes: data.additionalNotes || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  await store.set(id, JSON.stringify(commande));
  console.log(`✅ Commande sauvegardée: ${id}`);
  return commande;
}

async function getCommandes() {
  console.log('📦 getCommandes');
  const store = await getStore('commandes');
  const result = await store.list();
  
  const entries = result.blobs ?? result.items ?? [];
  console.log(`🔑 Entrées trouvées: ${entries.length}`);

  const commandes = [];
  for (const entry of entries) {
    try {
      const key = entry.key ?? entry;
      const cmd = await store.get(key);
      if (cmd) {
        const parsed = typeof cmd === 'string' ? JSON.parse(cmd) : cmd;
        commandes.push(parsed);
      }
    } catch (e) {
      console.error(`Erreur lecture ${entry.key ?? entry}:`, e.message);
    }
  }

  console.log(`📦 Total commandes: ${commandes.length}`);
  return commandes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function updateCommandeStatus(id, status, confirmedAmount = null) {
  const store = await getStore('commandes');
  const commande = await store.get(id);
  if (commande) {
    const parsed = typeof commande === 'string' ? JSON.parse(commande) : commande;
    const previousStatus = parsed.status;
    parsed.status = status;
    
    if (confirmedAmount !== null && status === 'confirmed') {
      parsed.confirmedAmount = confirmedAmount;
      parsed.originalBudget = parsed.budget;
      parsed.budget = confirmedAmount;
    }
    
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      parsed.originalBudget = parsed.budget;
      parsed.cancelledAt = new Date().toISOString();
    }
    
    await store.set(id, JSON.stringify(parsed));
    return parsed;
  }
  return null;
}

async function saveAvis(avis) {
  console.log('💾 saveAvis');
  const store = await getStore('avis');
  const id = generateId('AVIS');

  const nouvelAvis = {
    id,
    note: avis.note || 5,
    message: avis.message || '',
    nom: avis.nom || 'Client LoveExpress',
    photoUrl: avis.photoUrl || null,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  await store.set(id, JSON.stringify(nouvelAvis));
  console.log(`✅ Avis sauvegardé: ${id}`);
  return nouvelAvis;
}

async function getAvis(status = null) {
  console.log(`⭐ getAvis - status: ${status}`);
  const store = await getStore('avis');
  const result = await store.list();
  
  const entries = result.blobs ?? result.items ?? [];
  console.log(`🔑 Entrées avis: ${entries.length}`);

  const avis = [];
  for (const entry of entries) {
    try {
      const key = entry.key ?? entry;
      const a = await store.get(key);
      if (a) {
        const parsed = typeof a === 'string' ? JSON.parse(a) : a;
        if (status === null || parsed.status === status) {
          avis.push(parsed);
        }
      }
    } catch (e) {
      console.error(`Erreur lecture avis ${entry.key ?? entry}:`, e.message);
    }
  }

  console.log(`⭐ Total avis: ${avis.length}`);
  return avis.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function moderateAvis(id, status) {
  const store = await getStore('avis');
  const avis = await store.get(id);
  if (avis) {
    const parsed = typeof avis === 'string' ? JSON.parse(avis) : avis;
    parsed.status = status;
    await store.set(id, JSON.stringify(parsed));
    return parsed;
  }
  return null;
}

async function deleteAvis(id) {
  console.log(`🗑️ deleteAvis: ${id}`);
  const store = await getStore('avis');
  const avis = await store.get(id);
  if (avis) {
    await store.delete(id);
    console.log(`✅ Avis ${id} supprimé définitivement`);
    return true;
  }
  console.log(`❌ Avis ${id} non trouvé`);
  return false;
}

async function savePhoto(file, category) {
  const store = await getStore('photos');
  const id = `${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  let base64Data;
  if (Buffer.isBuffer(file)) {
    base64Data = file.toString('base64');
  } else if (typeof file === 'string') {
    base64Data = file;
  } else {
    return { id, url: null };
  }

  await store.set(id, JSON.stringify({ data: base64Data, category }));
  console.log(`✅ Photo sauvegardée: ${id}`);
  return { id, url: `/functions/get-photo?id=${id}` };
}

async function getPhotos(category = null) {
  const store = await getStore('photos');
  const result = await store.list();
  const entries = result.blobs ?? result.items ?? [];

  const photos = [];
  for (const entry of entries) {
    const key = entry.key ?? entry;
    if (category === null || key.startsWith(category)) {
      photos.push({ id: key, url: `/functions/get-photo?id=${key}` });
    }
  }
  return photos;
}

module.exports = {
  getStore,
  saveCommand,
  getCommandes,
  updateCommandeStatus,
  saveAvis,
  getAvis,
  moderateAvis,
  deleteAvis,
  savePhoto,
  getPhotos
};