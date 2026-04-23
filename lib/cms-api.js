// Utilitaires pour lire les données du CMS (fichiers JSON)

const BASE_PATH = process.env.NODE_ENV === 'development'
  ? process.cwd()
  : process.cwd();

// En production sur Netlify, les fichiers sont dans .next/server/app
export async function getCMSData(collection: string) {
  try {
    // Chemin vers les fichiers générés par Netlify CMS
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovesupriseexpress.netlify.app';
    
    // Option 1: Lire via l'API GitHub (recommandé pour prod)
    // Option 2: Lire via les fichiers statiques générés
    
    // Pour l'instant, retourner les données par défaut
    // À remplacer par une vraie lecture des fichiers CMS
    return null;
  } catch (error) {
    console.error(`Erreur lecture ${collection}:`, error);
    return null;
  }
}

export async function getServices() {
  try {
    const response = await fetch('/api/cms/services');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Erreur lecture services:', error);
  }
  return null;
}

export async function getGiftBaskets() {
  try {
    const response = await fetch('/api/cms/gift-baskets');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Erreur lecture gift baskets:', error);
  }
  return null;
}

export async function getRealisations() {
  try {
    const response = await fetch('/api/cms/realisations');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Erreur lecture realisations:', error);
  }
  return null;
}

export async function getHeroSlides() {
  try {
    const response = await fetch('/api/cms/hero-slides');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Erreur lecture hero slides:', error);
  }
  return null;
}
