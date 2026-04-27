// lib/utils/netlify-blobs.js
const { getStore: getNetlifyStore } = require('@netlify/blobs');

export async function getStore(storeName) {
  console.log(`🔍 Accès store: ${storeName}`);

  try {
    // Configuration MINIMALE - Netlify injecte automatiquement le contexte
    const store = getNetlifyStore({ name: storeName });
    
    // Test rapide pour valider l'accès
    await store.list({ limit: 1 });
    console.log(`✅ Store ${storeName} accessible`);
    
    return store;
  } catch (error) {
    console.error(`❌ Erreur store ${storeName}:`, error.message);
    throw error;
  }
}

function generateId(prefix) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

export async function saveCommand(data) {
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
  console.log(`✅ Commande sauvegardée: ${id}`, commande.clientName);
  return commande;
}

export async function getCommandes() {
  console.log('📦 getCommandes');
  const store = await getStore('commandes');
  
  // 🟢 CORRECTION: store.list() retourne directement un tableau de clés
  const keys = await store.list();
  console.log(`🔑 Clés brutes:`, keys);
  
  const commandes = [];
  for (const key of keys) {
    try {
      const cmd = await store.get(key);
      console.log(`📦 Lecture commande ${key}:`, cmd?.clientName);
      if (cmd) {
        // Si cmd est une string, la parser
        const parsed = typeof cmd === 'string' ? JSON.parse(cmd) : cmd;
        commandes.push(parsed);
      }
    } catch (err) {
      console.error(`❌ Erreur lecture ${key}:`, err.message);
    }
  }
  
  console.log(`📦 Total commandes: ${commandes.length}`);
  return commandes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateCommandeStatus(id, status) {
  const store = await getStore('commandes');
  const commande = await store.get(id);
  if (commande) {
    const parsed = typeof commande === 'string' ? JSON.parse(commande) : commande;
    parsed.status = status;
    await store.set(id, JSON.stringify(parsed));
  }
  return commande;
}

export async function saveAvis(avis) {
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
  console.log(`✅ Avis sauvegardé: ${id}`, nouvelAvis.nom);
  return nouvelAvis;
}

export async function getAvis(status = null) {
  console.log(`⭐ getAvis - status: ${status}`);
  const store = await getStore('avis');
  
  // 🟢 CORRECTION: store.list() retourne directement un tableau de clés
  const keys = await store.list();
  console.log(`🔑 Clés avis brutes:`, keys);
  
  const avis = [];
  for (const key of keys) {
    try {
      const a = await store.get(key);
      if (a) {
        const parsed = typeof a === 'string' ? JSON.parse(a) : a;
        if (status === null || parsed.status === status) {
          avis.push(parsed);
        }
      }
    } catch (err) {
      console.error(`❌ Erreur lecture ${key}:`, err.message);
    }
  }
  
  console.log(`⭐ Total avis: ${avis.length}`);
  return avis.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function moderateAvis(id, status) {
  const store = await getStore('avis');
  const avis = await store.get(id);
  if (avis) {
    const parsed = typeof avis === 'string' ? JSON.parse(avis) : avis;
    parsed.status = status;
    await store.set(id, JSON.stringify(parsed));
  }
  return avis;
}

export async function savePhoto(file, category) {
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

export async function getPhotos(category = null) {
  const store = await getStore('photos');
  const keys = await store.list();
  
  const photos = [];
  for (const key of keys) {
    if (category === null || key.startsWith(category)) {
      photos.push({ id: key, url: `/functions/get-photo?id=${key}` });
    }
  }
  return photos;
}