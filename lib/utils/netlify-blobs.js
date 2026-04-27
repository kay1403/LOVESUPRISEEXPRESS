// lib/utils/netlify-blobs.js
let netlifyBlobs = null;

// Chargement conditionnel pour Netlify uniquement
if (typeof process !== 'undefined' && process.env.NETLIFY === 'true') {
  try {
    netlifyBlobs = require('@netlify/blobs');
    console.log('✅ Netlify Blobs chargé');
  } catch (e) {
    console.error('❌ Erreur chargement Netlify Blobs:', e.message);
  }
}

export async function getStore(storeName) {
  // MODE PRODUCTION (Netlify)
  if (netlifyBlobs && process.env.NETLIFY === 'true') {
    console.log(`☁️ Netlify mode: store=${storeName}`);
    try {
      const { getStore: getNetlifyStore } = netlifyBlobs;
      const store = getNetlifyStore(storeName);
      return store;
    } catch (error) {
      console.error('❌ Erreur accès Netlify Blobs:', error.message);
      throw error;
    }
  }
  
  // MODE DÉVELOPPEMENT (local)
  console.log(`💻 Development mode: store=${storeName} (localStorage)`);
  return {
    get: async (key) => {
      try {
        const data = localStorage.getItem(`blob_${storeName}_${key}`);
        return data ? JSON.parse(data) : null;
      } catch (e) {
        console.error('Erreur lecture localStorage:', e);
        return null;
      }
    },
    set: async (key, value) => {
      try {
        localStorage.setItem(`blob_${storeName}_${key}`, JSON.stringify(value));
        console.log(`✅ localStorage set: ${storeName}/${key}`);
      } catch (e) {
        console.error('Erreur écriture localStorage:', e);
      }
    },
    list: async () => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(`blob_${storeName}_`)) {
          keys.push(key.replace(`blob_${storeName}_`, ''));
        }
      }
      return keys;
    }
  };
}

// generateId - Version simple et fiable
function generateId(prefix) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

export async function saveCommand(data) {
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
    deliveryMethod: data.deliveryMethod || 'delivery',
    message: data.message || '',
    specialInstructions: data.specialInstructions || '',
    isDiscreet: data.isDiscreet || false,
    needsPersonPresent: data.needsPersonPresent || false,
    additionalNotes: data.additionalNotes || '',
    status: 'pending', 
    createdAt: new Date().toISOString() 
  };
  await store.set(id, commande);
  console.log('✅ Commande sauvegardée:', id);
  return commande;
}

export async function getCommandes() {
  const store = await getStore('commandes');
  const keys = await store.list();
  const commandes = [];
  for (const key of keys) {
    const cmd = await store.get(key);
    if (cmd) commandes.push(cmd);
  }
  return commandes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateCommandeStatus(id, status) {
  const store = await getStore('commandes');
  const commande = await store.get(id);
  if (commande) {
    commande.status = status;
    await store.set(id, commande);
  }
  return commande;
}

export async function saveAvis(avis) {
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
  await store.set(id, nouvelAvis);
  console.log('✅ Avis sauvegardé:', id);
  return nouvelAvis;
}

export async function getAvis(status = null) {
  const store = await getStore('avis');
  const keys = await store.list();
  const avis = [];
  for (const key of keys) {
    const a = await store.get(key);
    if (a && (status === null || a.status === status)) {
      avis.push(a);
    }
  }
  return avis.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function moderateAvis(id, status) {
  const store = await getStore('avis');
  const avis = await store.get(id);
  if (avis) {
    avis.status = status;
    await store.set(id, avis);
  }
  return avis;
}

export async function savePhoto(file, category) {
  try {
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
    
    await store.set(id, { data: base64Data, category, createdAt: new Date().toISOString() });
    console.log('✅ Photo sauvegardée:', id);
    return { id, url: `/api/get-photo?id=${id}` };
  } catch (error) {
    console.error('❌ Erreur savePhoto:', error.message);
    return { id: null, url: null };
  }
}

export async function getPhotos(category = null) {
  const store = await getStore('photos');
  const keys = await store.list();
  const photos = [];
  for (const key of keys) {
    if (category === null || key.startsWith(category)) {
      photos.push({ id: key, url: `/api/get-photo?id=${key}` });
    }
  }
  return photos;
}