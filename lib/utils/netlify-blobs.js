// lib/utils/netlify-blobs.js
const { getStore: getNetlifyStore } = require('@netlify/blobs');

export async function getStore(storeName) {
  // Détection de l'environnement Netlify (pas de localStorage)
  const isNetlify = process.env.NETLIFY === 'true' || process.env.NODE_ENV === 'production';
  
  // Mode développement (local uniquement)
  if (!isNetlify && typeof localStorage !== 'undefined') {
    console.log('📦 Mode développement: utilisation localStorage');
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

  // Mode production (Netlify)
  console.log('☁️ Mode production: utilisation Netlify Blobs');
  try {
    const store = getNetlifyStore(storeName);
    return store;
  } catch (error) {
    console.error('❌ Erreur accès Netlify Blobs:', error.message);
    throw error;
  }
}

function generateId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${Date.now()}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function saveCommand(data) {
  const store = await getStore('commandes');
  const id = generateId('CMD');
  const commande = { 
    id, 
    ...data, 
    status: 'pending', 
    createdAt: new Date().toISOString() 
  };
  await store.set(id, commande);
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
    ...avis, 
    status: 'pending',
    photoUrl: avis.photoUrl || null,
    createdAt: new Date().toISOString() 
  };
  await store.set(id, nouvelAvis);
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
  return { id, url: `/api/get-photo?id=${id}` };
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