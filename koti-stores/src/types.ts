export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  category: string;
  unit: string;
  inStock?: boolean;
  isAd?: boolean;
  isOrganic?: boolean;
  isExotic?: boolean;
  isLocal?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: string[];
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'delivered' | 'cancelled';
  date: string;
  address?: string;
  paymentMethod?: string;
}

export interface SavedAddress {
  id: string;
  label: string;   // "Home" | "Office" | "Other"
  line1: string;
  line2: string;
  isDefault: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  bg: string;
  image: string;
  categoryId?: string;
  categoryName?: string;
}
