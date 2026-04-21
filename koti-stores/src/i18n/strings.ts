export const strings = {
  en: {
    // Common
    appName: 'Koti Stores',
    deliveryIn: 'Delivery in 30 mins',
    deliveringTo: 'Delivering to',
    searchPlaceholder: 'Search products, categories…',
    seeAll: 'See all',
    add: 'ADD',
    viewCart: 'View cart',
    items: 'items',
    item: 'item',
    
    // Home
    bestsellers: '🔥 Bestsellers',
    onOffer: '🏷️ On Offer',
    freshToday: '🌿 Fresh Today',
    offerBanner: '🎉 Use code KOTI25 for 25% off your next order',
    
    // Product Detail
    aboutProduct: 'About the Product',
    customerReviews: 'Customer Reviews',
    addToCart: 'Add to Cart',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    
    // Cart
    myCart: 'My Cart',
    emptyCart: 'Your cart is empty',
    shopNow: 'Shop Now',
    billDetails: 'Bill Details',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    platformFee: 'Platform Fee',
    grandTotal: 'Grand Total',
    free: 'FREE',
    checkout: 'Proceed to Checkout',
    
    // Auth
    login: 'Login',
    enterPhone: 'Enter your phone number',
    getOtp: 'Get OTP',
    verifyOtp: 'Verify OTP',
    resend: 'Resend OTP',
    setupProfile: 'Setup Profile',
    fullName: 'Full Name',
    email: 'Email Address',
    finish: 'Finish',
    skip: 'Skip for now',
  },
  hi: {
    // Common (Mock Hindi)
    appName: 'कोटि स्टोर्स',
    deliveryIn: '30 मिनट में डिलीवरी',
    deliveringTo: 'यहां डिलीवरी',
    searchPlaceholder: 'उत्पाद, श्रेणियां खोजें…',
    seeAll: 'सभी देखें',
    add: 'जोड़ें',
    viewCart: 'कार्ट देखें',
    items: 'सामान',
    item: 'सामान',
    
    // Home
    bestsellers: '🔥 बेस्टसेलर्स',
    onOffer: '🏷️ ऑफर पर',
    freshToday: '🌿 आज का ताजा',
    
    // Cart
    myCart: 'मेरी कार्ट',
    billDetails: 'बिल विवरण',
    grandTotal: 'कुल योग',
  }
};

export type Language = keyof typeof strings;
let currentLang: Language = 'en';

export const t = (key: keyof typeof strings['en']) => {
  return strings[currentLang][key] || strings['en'][key];
};

export const setLanguage = (lang: Language) => {
  currentLang = lang;
};
