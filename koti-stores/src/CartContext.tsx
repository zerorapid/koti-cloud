import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product, Order, SavedAddress } from './types';

const STORAGE_KEYS = {
  CART: '@koti_cart',
  ADDRESS: '@koti_address',
};

// ─── Coupon catalogue ─────────────────────────────────────────────────────────
const COUPONS: Record<string, number> = {
  GOLD25: 0.25,
  SILVER30: 0.30,
  DIAMOND35: 0.35,
  KOTI25: 0.25,
  SAVE10: 0.10,
  FRESH15: 0.15,
};

// ─── Context type ─────────────────────────────────────────────────────────────
interface CartContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;

  // Pricing
  subtotal: number;
  couponDiscount: number;
  couponCode: string;
  applyCoupon: (code: string) => string; // returns '' on success, error msg on fail
  removeCoupon: () => void;
  serviceFee: number;
  grandTotal: number;

  // Address
  addresses: SavedAddress[];
  activeAddress: SavedAddress;
  addAddress: (a: Omit<SavedAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setActiveAddress: (id: string) => void;



  // Orders
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (paymentMethod: string) => string; // returns orderId
  currentTier: 'none' | 'gold' | 'platinum' | 'diamond';
  nextTier: { amount: number; discount: string; name: string } | null;
}

// ─── Defaults ────────────────────────────────────────────────────────────────
const DEFAULT_ADDRESSES: SavedAddress[] = [
  { id: 'a1', label: 'Home', line1: '124 Park Avenue', line2: 'Bangalore - 560001', isDefault: true },
  { id: 'a2', label: 'Office', line1: '7th Floor, Prestige Tower', line2: 'MG Road, Bangalore - 560025', isDefault: false },
];

const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart]             = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponRate, setCouponRate] = useState(0);
  const [addresses, setAddresses]   = useState<SavedAddress[]>(DEFAULT_ADDRESSES);
  const [activeAddressId, setActiveAddressId] = useState('a1');
  const [orders, setOrders]         = useState<Order[]>([]);

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Initial Load from Storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedCart = await AsyncStorage.getItem(STORAGE_KEYS.CART);
        const savedAddr = await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS);
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedAddr) setActiveAddressId(savedAddr);
      } catch (e) {
        console.error('Failed to load storage', e);
      }
    };
    loadData();
  }, []);

  // Save Cart on change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Save Address on change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.ADDRESS, activeAddressId);
  }, [activeAddressId]);

  // ── Cart mutations ──────────────────────────────────────────────────────────
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart((p) => p.filter((i) => i.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(id); return; }
    setCart((p) => p.map((i) => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setCouponRate(0);
  };

  // ── Pricing ─────────────────────────────────────────────────────────────────
  const totalItems    = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal      = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  
  // Tiered Membership Logic
  let tierRate = 0;
  let currentTier: 'none' | 'gold' | 'platinum' | 'diamond' = 'none';
  
  if (subtotal >= 2000) { tierRate = 0.35; currentTier = 'diamond'; }
  else if (subtotal >= 1000) { tierRate = 0.30; currentTier = 'platinum'; }
  else if (subtotal >= 500) { tierRate = 0.25; currentTier = 'gold'; }

  // Next Tier logic
  let nextTier = null;
  if (subtotal < 500) {
    nextTier = { amount: 500 - subtotal, discount: '25%', name: 'Gold' };
  } else if (subtotal < 1000) {
    nextTier = { amount: 1000 - subtotal, discount: '30%', name: 'Platinum' };
  } else if (subtotal < 2000) {
    nextTier = { amount: 2000 - subtotal, discount: '35%', name: 'Diamond' };
  }

  // Use either the manually applied coupon or the auto-tier rate (whichever is higher)
  const effectiveRate = Math.max(tierRate, couponRate);
  const couponDiscount = Math.round(subtotal * effectiveRate);
  
  const afterCoupon   = subtotal - couponDiscount;
  
  // Total fees (Delivery + Handling + Platform) = 12
  const serviceFee    = 12; 
  const grandTotal    = afterCoupon + serviceFee;

  // ── Coupon ──────────────────────────────────────────────────────────────────
  const applyCoupon = (code: string): string => {
    const rate = COUPONS[code.trim().toUpperCase()];
    if (!rate) return 'Invalid coupon code';
    if (subtotal === 0) return 'Add items to cart first';
    setCouponCode(code.trim().toUpperCase());
    setCouponRate(rate);
    return '';
  };

  const removeCoupon = () => { setCouponCode(''); setCouponRate(0); };

  // ── Address ─────────────────────────────────────────────────────────────────
  const activeAddress = addresses.find((a) => a.id === activeAddressId) ?? addresses[0];

  const addAddress = (a: Omit<SavedAddress, 'id'>) => {
    const id = `a${Date.now()}`;
    setAddresses((p) => [...p, { ...a, id }]);
  };

  const deleteAddress = (id: string) =>
    setAddresses((p) => p.filter((a) => a.id !== id));

  const setActiveAddress = (id: string) => setActiveAddressId(id);



  // ── Orders ──────────────────────────────────────────────────────────────────
  const activeOrder = orders.find((o) => o.id === activeOrderId) || null;

  const placeOrder = (paymentMethod: string): string => {
    const orderId = `ORD-${Date.now()}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total: grandTotal,
      status: 'pending',
      date: dateStr,
      address: `${activeAddress.label}: ${activeAddress.line1}`,
      paymentMethod,
    };

    setOrders((p) => [newOrder, ...p]);
    setActiveOrderId(orderId);
    clearCart();
    return orderId;
  };

  return (
    <CartContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems,
        subtotal, couponDiscount, couponCode, applyCoupon, removeCoupon,
        serviceFee, grandTotal,
        addresses, activeAddress, addAddress, deleteAddress, setActiveAddress,

        orders, activeOrder, placeOrder,
        currentTier, nextTier,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
