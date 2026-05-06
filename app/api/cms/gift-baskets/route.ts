import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { translateGiftBasket } from '@/lib/cms-translations';

const defaultGiftBaskets = [
  { id: 1, name: 'Birthday', subtitle: 'Gift Basket', badge: 'Anniversaire', description: 'Pour un anniversaire inoubliable', longDescription: 'Mini gâteau d\'anniversaire, bougie, carte personnalisée, jus de fruit.', priceStandard: 15000, pricePremium: 80000, popular: true, image: 'https://i.pinimg.com/1200x/ec/36/e4/ec36e470b8d41448d810491847893f83.jpg', includes: ['Mini gâteau anniversaire', 'Bougie', 'Carte personnalisée', 'Jus de fruit'] },
  { id: 2, name: 'Romantic', subtitle: 'Gift Basket', badge: 'Romantique', description: 'Pour votre moitié', longDescription: 'Chocolat, bougies parfumées, lettre d\'amour, bouquet de fleurs.', priceStandard: 40000, pricePremium: 50000, popular: true, image: 'https://i.pinimg.com/736x/63/a7/09/63a709e557275506ec67b31b59642c44.jpg', includes: ['Chocolat', 'Bougies parfumées', 'Lettre d\'amour', 'Bouquet de fleurs'] },
  { id: 3, name: 'New Baby', subtitle: 'Gift Basket', badge: 'Naissance', description: 'Bienvenue au nouveau-né', longDescription: 'Vêtements bébé, couches, produits de soin, doudou.', priceStandard: 40000, pricePremium: 80000, popular: false, image: 'https://i.pinimg.com/1200x/48/b0/79/48b07903362683f89724cc49e705a008.jpg', includes: ['Vêtements bébé', 'Couches', 'Produits de soin', 'Doudou'] },
  { id: 4, name: 'Gourmet', subtitle: 'Gift Basket', badge: 'Gastronomie', description: 'Pour les gourmands', longDescription: 'Biscuits, fruits, chocolat, jus, bonbons.', priceStandard: 20000, pricePremium: 70000, popular: true, image: 'https://i.pinimg.com/1200x/5d/1c/43/5d1c43fa44d4ceec1d095ce415241b0a.jpg', includes: ['Biscuits', 'Fruits', 'Chocolat', 'Jus', 'Bonbons'] },
  { id: 5, name: 'Wellness', subtitle: 'Gift Basket', badge: 'Bien-être', description: 'Détente et bien-être', longDescription: 'Thé, huiles essentielles, savon, masques visage, parfum, crème.', priceStandard: 50000, pricePremium: 100000, popular: false, image: 'https://i.pinimg.com/1200x/fe/c3/97/fec397b6fbc634e851457411b107e4c5.jpg', includes: ['Thé', 'Huiles essentielles', 'Savon', 'Masques visage', 'Parfum', 'Crème'] }
];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'fr';
    
    const contentPath = path.join(process.cwd(), 'content', 'gift_baskets');
    let baskets = [];
    
    if (fs.existsSync(contentPath)) {
      // ✅ Lire TOUS les fichiers et dédupliquer par ID
      const files = fs.readdirSync(contentPath)
        .filter(f => f.endsWith('.json'))
        .map(f => ({
          path: path.join(contentPath, f),
          mtime: fs.statSync(path.join(contentPath, f)).mtime.getTime()
        }))
        .sort((a, b) => a.mtime - b.mtime);

      const basketMap = new Map();

      for (const file of files) {
        const content = fs.readFileSync(file.path, 'utf-8');
        const basket = JSON.parse(content);
        basketMap.set(basket.id, basket);
      }

      baskets = Array.from(basketMap.values());
    }
    
    // Si aucun fichier trouvé, utiliser les données par défaut
    if (baskets.length === 0) {
      baskets = [...defaultGiftBaskets];
    }
    
    // ✅ TOUJOURS appliquer la traduction si la langue n'est pas française
    if (lang !== 'fr') {
      const translatedBaskets = baskets.map((basket, idx) => translateGiftBasket(basket, lang, idx));
      return NextResponse.json({ success: true, giftBaskets: translatedBaskets });
    }
    
    return NextResponse.json({ success: true, giftBaskets: baskets });
  } catch (error) {
    console.error('Erreur lecture gift baskets:', error);
    const lang = new URL(request.url).searchParams.get('lang') || 'fr';
    let defaultData = [...defaultGiftBaskets];
    if (lang !== 'fr') {
      defaultData = defaultData.map((basket, idx) => translateGiftBasket(basket, lang, idx));
    }
    return NextResponse.json({ success: true, giftBaskets: defaultData });
  }
}