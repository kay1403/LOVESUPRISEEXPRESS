export async function getStore(storeName) {
  if (process.env.NODE_ENV === 'development') {
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

  const { getStore: getNetlifyStore } = await import('@netlify/blobs');
  return getNetlifyStore(storeName);
}

// FONCTION generateId CORRIGÉE - Version sans crypto pour Netlify
function generateId(prefix) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

// FONCTION saveCommand CORRIGÉE - Avec valeurs par défaut
export async function saveCommand(data) {
  try {
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
  } catch (error) {
    console.error('❌ Erreur saveCommand:', error.message);
    throw error;
  }
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
  try {
    const store = await getStore('photos');
    const id = `${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let base64Data;
    if (Buffer.isBuffer(file)) {
      base64Data = file.toString('base64');
    } else if (typeof file === 'string') {
      base64Data = file;
    } else if (file && file.data) {
      base64Data = file.data;
    } else {
      console.error('Format de fichier non supporté:', typeof file);
      return { id, url: null };
    }
    
    if (!base64Data || base64Data.length === 0) {
      console.error('Données base64 vides');
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