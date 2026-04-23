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

function generateId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${Date.now()}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function saveCommand(data) {
  const store = await getStore('commandes');
  const id = generateId('CMD');
  const commande = { id, ...data, status: 'pending', createdAt: new Date().toISOString() };
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
  const nouvelAvis = { id, ...avis, status: 'pending', createdAt: new Date().toISOString() };
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
  await store.set(id, file);
  return { id, url: `/.netlify/images/${id}` };
}

export async function getPhotos(category = null) {
  const store = await getStore('photos');
  const keys = await store.list();
  const photos = [];
  for (const key of keys) {
    if (category === null || key.startsWith(category)) {
      photos.push({ id: key, url: `/.netlify/images/${key}` });
    }
  }
  return photos;
}
