import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const defaultGiftBaskets = [
  { id: 1, name: 'Birthday', subtitle: 'Gift Basket', badge: 'Anniversaire', description: 'Pour un anniversaire inoubliable', longDescription: 'Mini gâteau d\'anniversaire, bougie, carte personnalisée, jus de fruit.', priceStandard: 15000, pricePremium: 80000, popular: true, image: 'https://i.pinimg.com/1200x/ec/36/e4/ec36e470b8d41448d810491847893f83.jpg', includes: ['Mini gâteau anniversaire', 'Bougie', 'Carte personnalisée', 'Jus de fruit'] },
  { id: 2, name: 'Romantic', subtitle: 'Gift Basket', badge: 'Romantique', description: 'Pour votre moitié', longDescription: 'Chocolat, bougies parfumées, lettre d\'amour, bouquet de fleurs.', priceStandard: 40000, pricePremium: 50000, popular: true, image: 'https://i.pinimg.com/736x/63/a7/09/63a709e557275506ec67b31b59642c44.jpg', includes: ['Chocolat', 'Bougies parfumées', 'Lettre d\'amour', 'Bouquet de fleurs'] },
  { id: 3, name: 'New Baby', subtitle: 'Gift Basket', badge: 'Naissance', description: 'Bienvenue au nouveau-né', longDescription: 'Vêtements bébé, couches, produits de soin, doudou.', priceStandard: 40000, pricePremium: 80000, popular: false, image: 'https://i.pinimg.com/1200x/48/b0/79/48b07903362683f89724cc49e705a008.jpg', includes: ['Vêtements bébé', 'Couches', 'Produits de soin', 'Doudou'] },
  { id: 4, name: 'Gourmet', subtitle: 'Gift Basket', badge: 'Gastronomie', description: 'Pour les gourmands', longDescription: 'Biscuits, fruits, chocolat, jus, bonbons.', priceStandard: 20000, pricePremium: 70000, popular: true, image: 'https://i.pinimg.com/1200x/5d/1c/43/5d1c43fa44d4ceec1d095ce415241b0a.jpg', includes: ['Biscuits', 'Fruits', 'Chocolat', 'Jus', 'Bonbons'] },
  { id: 5, name: 'Wellness', subtitle: 'Gift Basket', badge: 'Bien-être', description: 'Détente et bien-être', longDescription: 'Thé, huiles essentielles, savon, masques visage, parfum, crème.', priceStandard: 50000, pricePremium: 100000, popular: false, image: 'https://i.pinimg.com/1200x/fe/c3/97/fec397b6fbc634e851457411b107e4c5.jpg', includes: ['Thé', 'Huiles essentielles', 'Savon', 'Masques visage', 'Parfum', 'Crème'] }
];

export async function GET() {
  try {
    const contentPath = path.join(process.cwd(), 'content', 'gift_baskets');
    
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath);
      const baskets = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(contentPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const basket = JSON.parse(content);
          baskets.push(basket);
        }
      }
      
      if (baskets.length > 0) {
        return NextResponse.json({ success: true, giftBaskets: baskets });
      }
    }
    
    return NextResponse.json({ success: true, giftBaskets: defaultGiftBaskets });
  } catch (error) {
    console.error('Erreur lecture gift baskets:', error);
    return NextResponse.json({ success: true, giftBaskets: defaultGiftBaskets });
  }
}
