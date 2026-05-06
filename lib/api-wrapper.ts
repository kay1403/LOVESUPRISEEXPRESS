// lib/api-wrapper.ts (CORRIGÉ)
import { useEffect, useState } from 'react';
import { CMS_FALLBACKS } from './cms-fallback';
import { useTranslation } from 'react-i18next';

export function useCMSSafe<T>(
  fetchFn: () => Promise<T>,
  fallbackData: T,
  dependencies: React.DependencyList = []
): { data: T; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFn();
        if (isMounted && result) {
          setData(result);
        } else if (isMounted) {
          setData(fallbackData);
        }
      } catch (err) {
        console.error('Erreur CMS:', err);
        if (isMounted) {
          setError(err as Error);
          setData(fallbackData);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    
    return () => { isMounted = false; };
  }, dependencies);

  return { data, loading, error };
}

// ✅ CORRECTION : Hook qui utilise la langue courante
export function useFooterSafe() {
  const { i18n } = useTranslation();
  
  return useCMSSafe(
    async () => {
      const lang = i18n.language; // ✅ Langue dynamique
      const res = await fetch(`/api/cms/footer?lang=${lang}`);
      const data = await res.json();
      if (data.success && data.footer) {
        return {
          ...CMS_FALLBACKS.footer,
          ...data.footer,
          hours: Array.isArray(data.footer.hours) ? data.footer.hours : CMS_FALLBACKS.footer.hours,
          services: Array.isArray(data.footer.services) ? data.footer.services : CMS_FALLBACKS.footer.services
        };
      }
      return CMS_FALLBACKS.footer;
    },
    CMS_FALLBACKS.footer,
    [i18n.language] // ✅ Re-fetch quand la langue change
  );
}

// ✅ CORRECTION Services
export function useServicesSafe() {
  const { i18n } = useTranslation();
  
  return useCMSSafe(
    async () => {
      const lang = i18n.language;
      const res = await fetch(`/api/cms/services?lang=${lang}`);
      const data = await res.json();
      if (data.success && data.services && data.services.length > 0) {
        return data.services;
      }
      return CMS_FALLBACKS.services;
    },
    CMS_FALLBACKS.services,
    [i18n.language]
  );
}

// ✅ CORRECTION Gift Baskets
export function useGiftBasketsSafe() {
  const { i18n } = useTranslation();
  
  return useCMSSafe(
    async () => {
      const lang = i18n.language;
      const res = await fetch(`/api/cms/gift-baskets?lang=${lang}`);
      const data = await res.json();
      if (data.success && data.giftBaskets && data.giftBaskets.length > 0) {
        return data.giftBaskets;
      }
      return CMS_FALLBACKS.giftBaskets;
    },
    CMS_FALLBACKS.giftBaskets,
    [i18n.language]
  );
}

// ✅ CORRECTION Hero Slides
export function useHeroSlidesSafe() {
  const { i18n } = useTranslation();
  
  return useCMSSafe(
    async () => {
      const lang = i18n.language;
      const res = await fetch(`/api/cms/hero-slides?lang=${lang}`);
      const data = await res.json();
      if (data.success && data.slides && data.slides.length > 0) {
        return data.slides;
      }
      return CMS_FALLBACKS.heroSlides;
    },
    CMS_FALLBACKS.heroSlides,
    [i18n.language]
  );
}

// ✅ CORRECTION Réalisations
export function useRealisationsSafe() {
  const { i18n } = useTranslation();
  
  return useCMSSafe(
    async () => {
      const lang = i18n.language;
      const res = await fetch(`/api/cms/realisations?lang=${lang}`);
      const data = await res.json();
      if (data.success && data.realisations && data.realisations.length > 0) {
        return data.realisations;
      }
      return CMS_FALLBACKS.realisations;
    },
    CMS_FALLBACKS.realisations,
    [i18n.language]
  );
}

// ✅ CORRECTION About Images (pas de langue nécessaire)
export function useAboutImagesSafe() {
  return useCMSSafe(
    async () => {
      const res = await fetch(`/api/cms/about-images`);
      const data = await res.json();
      if (data.success && data.images && data.images.length > 0) {
        return data.images;
      }
      return CMS_FALLBACKS.aboutImages;
    },
    CMS_FALLBACKS.aboutImages,
    []
  );
}