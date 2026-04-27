// lib/utils/netlify-blobs.js
const { getStore: getNetlifyStore } = require('@netlify/blobs');

export async function getStore(storeName) {
  // Netlify Functions (production) - PAS DE token/siteID manuel
  // Le SDK utilise automatiquement le contexte de la fonction
  console.log(`☁️ Netlify mode: ${storeName}`);
  
  try {
    const store = getNetlifyStore({ name: storeName });
    
    // Test simple pour vérifier l'accès
    await store.list();
    
    console.log(`✅ Store ${storeName} accessible`);
    return store;
  } catch (error) {
    console.error(`❌ Erreur accès store ${storeName}:`, error.message);
    throw error;
  }
}

// Le reste du code reste identique...
function generateId(prefix) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

export async function saveCommand(data) {
  console.log('💾 saveCommand - début');
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
  console.log('📦 getCommandes - début');
  const store = await getStore('commandes');
  const keys = await store.list();
  console.log(`🔑 Clés trouvées: ${keys.length}`);
  
  const commandes = [];
  for (const key of keys) {
    const cmd = await store.get(key);
    if (cmd) {
      commandes.push(cmd);
    }
  }
  console.log(`📦 Total commandes: ${commandes.length}`);
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
  console.log('💾 saveAvis - début');
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
  console.log('⭐ getAvis - début, status:', status);
  const store = await getStore('avis');
  const keys = await store.list();
  console.log(`🔑 Clés avis trouvées: ${keys.length}`);
  
  const avis = [];
  for (const key of keys) {
    const a = await store.get(key);
    if (a && (status === null || a.status === status)) {
      avis.push(a);
    }
  }
  console.log(`⭐ Total avis: ${avis.length}`);
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