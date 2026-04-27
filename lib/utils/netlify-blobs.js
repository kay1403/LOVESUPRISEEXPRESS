// Version alternative qui utilise le contexte Netlify
const { getStore: getNetlifyStore } = require('@netlify/blobs');

export async function getStore(storeName) {
  // Mode développement (local)
  if (typeof localStorage !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`💻 Dev mode: ${storeName} (localStorage)`);
    return {
      get: async (key) => {
        const data = localStorage.getItem(`blob_${storeName}_${key}`);
        return data ? JSON.parse(data) : null;
      },
      set: async (key, value) => {
        localStorage.setItem(`blob_${storeName}_${key}`, JSON.stringify(value));
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

  // Mode production - utiliser le contexte Netlify
  console.log(`☁️ Production mode: ${storeName}`);
  try {
    const store = getNetlifyStore(storeName);
    return store;
  } catch (error) {
    console.error(`❌ Erreur:`, error.message);
    // Fallback: essayer avec siteID explicite
    const storeWithId = getNetlifyStore({
      name: storeName,
      siteID: '69da8da13fe2118a6d18109f'
    });
    return storeWithId;
  }
}