import { Category, Product } from './types';
import * as SharedDB from './koti-db';

// ─── Categories (Synced) ──────────────────────────────────────────────────────
export const CATEGORIES: Category[] = SharedDB.CATEGORIES.map(cat => ({
  ...cat,
  subcategories: ['All Products', 'Organic', 'Best Sellers'] // Added default subcats for UX
}));

// ─── Banners (Synced) ─────────────────────────────────────────────────────────
export const BANNERS = SharedDB.BANNERS.map(b => ({
  id: b.id,
  title: b.title,
  subtitle: 'Fresh deals just for you',
  bg: b.slot === 'Hero' ? '#E11D48' : '#1e293b',
  image: b.img,
  categoryId: 'fruits',
  categoryName: 'Fruits & Veggies',
}));

// ─── Products (Synced) ────────────────────────────────────────────────────────
export const PRODUCTS: Product[] = SharedDB.PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  description: `${p.name} - Premium quality sourced for Koti. Labels: ${p.labels?.join(', ')}`,
  price: p.price,
  originalPrice: p.price + 20,
  rating: 4.8,
  reviewCount: 120,
  image: p.img,
  category: p.category,
  unit: '1 kg',
  inStock: p.status === 'In Stock' || p.status === 'Low Stock',
  isOrganic: p.labels?.includes('Organic'),
  isLocal: p.labels?.includes('Local'),
  isExotic: p.labels?.includes('Exotic')
}));

// ─── Sections for Home ────────────────────────────────────────────────────────
export const BESTSELLERS = PRODUCTS.slice(0, 4);
export const ON_OFFER    = PRODUCTS.filter(p => p.id === 'sku-sync-test'); // Highlighting the test product
export const FRESH_TODAY = PRODUCTS.filter(p => p.category === 'fruits' || p.category === 'dairy');
