import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, 
  Dimensions, ScrollView, Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, Search, Share2, SlidersHorizontal, 
  ChevronDown, Star, Clock, ShoppingCart, CheckCircle2,
  X, ChevronRight
} from 'lucide-react-native';
import { useCart } from '../CartContext';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';
import { Skeleton, ProductSkeleton } from '../components/Skeleton';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const SIDEBAR_W = 80;

export default function CategoryProductsScreen({ route, navigation }: any) {
  const { categoryId, categoryName } = route.params;
  const { cart, activeAddress, addToCart, updateQuantity, grandTotal, deliveryFee } = useCart();
  
  const category = CATEGORIES.find(c => c.id === categoryId);
  const subcategories = category?.subcategories || ['All'];
  
  const [activeSub, setActiveSub] = useState(subcategories[0]);
  const [showFreeDeliveryToast, setShowFreeDeliveryToast] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance'); 
  const [activeType, setActiveType] = useState('All');

  const productTypes = useMemo(() => ['All', 'Organic', 'Exotic', 'Local', 'Discounted'], []);

  // Mock initial load
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    if (isLoading) return [];
    let list = PRODUCTS.filter(p => p.category === categoryId);
    
    if (activeSub !== subcategories[0]) {
       list = list.filter(p => p.name.toLowerCase().includes(activeSub.toLowerCase()) || p.description.toLowerCase().includes(activeSub.toLowerCase()));
    }

    if (activeType !== 'All') {
      if (activeType === 'Discounted') list = list.filter(p => p.originalPrice);
      else if (activeType === 'Organic') list = list.filter(p => p.isOrganic);
      else if (activeType === 'Exotic') list = list.filter(p => p.isExotic);
      else if (activeType === 'Local') list = list.filter(p => p.isLocal);
    }

    if (sortBy === 'price_low') list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_high') list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return list;
  }, [categoryId, activeSub, activeType, sortBy, subcategories, isLoading]);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
             <ChevronLeft size={24} color={Colors.text} />
           </TouchableOpacity>
           <View style={{ flex: 1, marginLeft: 12 }}>
              <Skeleton width="40%" height={16} />
              <Skeleton width="60%" height={12} style={{ marginTop: 4 }} />
           </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
           <View style={{ width: SIDEBAR_W, backgroundColor: Colors.surfaceGray, paddingVertical: 16, alignItems: 'center', gap: 20 }}>
              {[1,2,3,4,5].map(i => <Skeleton key={i} width={50} height={50} borderRadius={25} />)}
           </View>
           <View style={{ flex: 1, padding: 12 }}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                 <Skeleton width={80} height={32} borderRadius={8} />
                 <Skeleton width={80} height={32} borderRadius={8} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                 <ProductSkeleton />
                 <ProductSkeleton />
                 <ProductSkeleton />
                 <ProductSkeleton />
              </View>
           </View>
        </View>
      </SafeAreaView>
    );
  }

  const renderProduct = ({ item }: { item: any }) => {
    const cartItem = cart.find(i => i.id === item.id);
    const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

    return (
      <TouchableOpacity 
        style={styles.productCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >


        {/* Product Image */}
        <View style={styles.imgContainer}>
          <Image source={{ uri: item.image }} style={styles.productImg} />
          {item.isAd && (
            <View style={styles.adBadge}>
              <Text style={styles.adText}>Ad</Text>
            </View>
          )}
          <View style={styles.vegBadge}>
            <View style={styles.vegCircle} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.weightText}>{item.unit}</Text>
          
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceText}>₹{item.price}</Text>
              {item.originalPrice && (
                <Text style={styles.oldPrice}>₹{item.originalPrice}</Text>
              )}
            </View>
            
            {cartItem ? (
              <View style={styles.qtyStepper}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, cartItem.quantity - 1)}>
                  <Text style={styles.stepperAction}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{cartItem.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, cartItem.quantity + 1)}>
                  <Text style={styles.stepperAction}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addBtn} 
                onPress={() => addToCart(item)}
              >
                <Text style={styles.addBtnText}>ADD</Text>
              </TouchableOpacity>
            )}
          </View>



          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1,2,3,4,5].map(s => <Star key={s} size={10} color="#f59e0b" fill="#f59e0b" />)}
            </View>
            <Text style={styles.reviewCount}>{item.reviewCount || '21,245'}</Text>
          </View>

          <View style={styles.deliveryInfo}>
            <Clock size={12} color={Colors.textTertiary} />
            <Text style={styles.deliveryTime}>14 mins</Text>
            <View style={styles.stockInfo}>
              <Text style={styles.stockText}>📦 4 left</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <TouchableOpacity 
            style={styles.addressSelector}
            onPress={() => navigation.navigate('Profile', { screen: 'AddressList' })}
          >
            <Text style={styles.addressLabel} numberOfLines={1}>
              Delivering to Other: <Text style={{ color: Colors.textSecondary }}>{activeAddress.label}</Text>
            </Text>
            <ChevronDown size={14} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}><Share2 size={22} color={Colors.text} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Search')}><Search size={22} color={Colors.text} /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContainer}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <FlatList
            data={subcategories}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.sidebarItem, activeSub === item && styles.sidebarItemActive]}
                onPress={() => setActiveSub(item)}
              >
                <View style={styles.sidebarImgContainer}>
                  <Image source={{ uri: `https://picsum.photos/seed/${item}/100/100` }} style={styles.sidebarImg} />
                </View>
                <Text style={[styles.sidebarText, activeSub === item && styles.sidebarTextActive]}>
                  {item}
                </Text>
                {activeSub === item && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Filters Bar */}
          <View style={styles.filtersBar}>
            <TouchableOpacity 
              style={[styles.filterBtn, sortBy !== 'relevance' && styles.filterBtnActive]}
              onPress={() => {
                const next = sortBy === 'relevance' ? 'price_low' : sortBy === 'price_low' ? 'price_high' : sortBy === 'price_high' ? 'rating' : 'relevance';
                setSortBy(next);
              }}
            >
              <SlidersHorizontal size={14} color={sortBy !== 'relevance' ? '#fff' : Colors.text} />
              <Text style={[styles.filterBtnText, sortBy !== 'relevance' && styles.filterBtnTextActive]}>
                {sortBy === 'relevance' ? 'Sort' : sortBy.replace('_', ' ')}
              </Text>
              <ChevronDown size={14} color={sortBy !== 'relevance' ? '#fff' : Colors.text} />
            </TouchableOpacity>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.typesScroll}
              contentContainerStyle={{ gap: 8, paddingRight: 16 }}
            >
              {productTypes.map(t => (
                <TouchableOpacity 
                  key={t} 
                  style={[styles.typeChip, activeType === t && styles.typeChipActive]}
                  onPress={() => setActiveType(t)}
                >
                  <Text style={[styles.typeChipText, activeType === t && styles.typeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredProducts}
            keyExtractor={item => item.id}
            numColumns={2}
            renderItem={renderProduct}
            contentContainerStyle={styles.productList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyResults}>
                <Text style={styles.emptyResultsText}>No products found in this category.</Text>
                <TouchableOpacity onPress={() => {setActiveSub(subcategories[0]); setActiveType('All'); setSortBy('relevance');}} style={styles.resetBtn}>
                   <Text style={styles.resetBtnText}>Clear Filters</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </View>

      {/* Free Delivery Toast */}
      {showFreeDeliveryToast && (
        <View style={styles.toastContainer}>
          <View style={styles.toast}>
            <View style={styles.toastLeft}>
              <View style={styles.checkCircle}>
                <CheckCircle2 size={24} color="#fff" fill={Colors.success} />
              </View>
              <View>
                <Text style={styles.toastTitle}>Yay! You got FREE Delivery</Text>
                <TouchableOpacity style={styles.toastSubtitleRow}>
                  <Text style={styles.toastSubtitle}>No coupon needed</Text>
                  <ChevronRight size={14} color={Colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowFreeDeliveryToast(false)} style={styles.toastClose}>
              <X size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Floating View Cart Bar */}
      {totalItems > 0 && (
        <TouchableOpacity 
          style={styles.cartBar}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Cart')}
        >
          <View style={styles.cartBarLeft}>
            <View style={styles.cartImgContainer}>
               <Image source={{ uri: filteredProducts[0]?.image }} style={styles.cartImg} />
            </View>
            <View>
              <Text style={styles.cartBarTitle}>View cart</Text>
              <Text style={styles.cartBarSubtitle}>{totalItems} Item</Text>
            </View>
          </View>
          <View style={styles.cartBarRight}>
            <Text style={styles.viewCartText}>VIEW CART</Text>
            <ChevronRight size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.sm,
    borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#fff',
  },
  backBtn: { padding: Spacing.xxs },
  headerTitleContainer: { flex: 1, marginLeft: Spacing.sm },
  headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  addressSelector: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  addressLabel: { fontSize: 12, color: Colors.success, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: Spacing.md, paddingRight: Spacing.xs },
  iconBtn: { padding: 4 },

  mainContainer: { flex: 1, flexDirection: 'row' },

  // Sidebar
  sidebar: { width: SIDEBAR_W, backgroundColor: Colors.surfaceGray, borderRightWidth: 1, borderColor: '#eee' },
  sidebarItem: { 
    alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: 4,
    position: 'relative',
  },
  sidebarItemActive: { backgroundColor: '#fff' },
  sidebarImgContainer: { 
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee', 
    marginBottom: 6, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd'
  },
  sidebarImg: { width: '100%', height: '100%' },
  sidebarText: { fontSize: 10, textAlign: 'center', color: Colors.textSecondary, fontWeight: '600' },
  sidebarTextActive: { color: Colors.text, fontWeight: '800' },
  activeIndicator: { 
    position: 'absolute', right: 0, top: 10, bottom: 10, 
    width: 3, backgroundColor: Colors.success, borderRadius: 2
  },

  // Content
  content: { flex: 1, backgroundColor: '#fff' },
  filtersBar: { 
    flexDirection: 'row', padding: Spacing.sm, gap: Spacing.sm, 
    borderBottomWidth: 1, borderColor: '#eee',
  },
  filterBtn: { 
    flexDirection: 'row', alignItems: 'center', gap: 4, 
    paddingHorizontal: 8, paddingVertical: 6, 
    borderWidth: 1, borderColor: '#ddd', borderRadius: Radii.sm,
    backgroundColor: '#fff',
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterBtnText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  filterBtnTextActive: { color: '#fff' },

  typesScroll: { flex: 1, marginLeft: 8 },
  typeChip: { 
    paddingHorizontal: 12, paddingVertical: 6, 
    backgroundColor: '#F3F4F6', borderRadius: Radii.full,
    borderWidth: 1, borderColor: 'transparent'
  },
  typeChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  typeChipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  typeChipTextActive: { color: Colors.primary, fontWeight: '800' },

  emptyResults: { padding: 40, alignItems: 'center' },
  emptyResultsText: { fontSize: 14, color: Colors.textTertiary, textAlign: 'center', marginBottom: 16 },
  resetBtn: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.primary, borderRadius: Radii.md },
  resetBtnText: { color: '#fff', fontWeight: '800' },

  productList: { padding: 8, paddingBottom: 100 },
  productCard: { 
    flex: 1, margin: 8, backgroundColor: '#fff', borderRadius: Radii.md, 
    borderWidth: 1, borderColor: '#eee', padding: 12,
    maxWidth: (SCREEN_W - SIDEBAR_W - 32) / 2,
    ...Shadows.sm,
  },

  imgContainer: { width: '100%', height: 100, marginBottom: 8, position: 'relative' },
  productImg: { width: '100%', height: '100%', resizeMode: 'contain' },
  adBadge: { 
    position: 'absolute', left: 0, top: 0, backgroundColor: 'rgba(0,0,0,0.4)', 
    paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2 
  },
  adText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  vegBadge: { 
    position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, 
    borderWidth: 1, borderColor: Colors.success, justifyContent: 'center', alignItems: 'center' 
  },
  vegCircle: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },

  cardContent: { gap: 4 },
  weightText: { fontSize: 11, color: Colors.textTertiary, fontWeight: '600' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceText: { fontSize: 15, fontWeight: '800', color: Colors.text },
  oldPrice: { fontSize: 11, color: Colors.textTertiary, textDecorationLine: 'line-through' },
  discountText: { fontSize: 10, color: Colors.primary, fontWeight: '800' },
  productName: { fontSize: 12, fontWeight: '700', color: Colors.text, height: 32 },
  
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stars: { flexDirection: 'row', gap: 1 },
  reviewCount: { fontSize: 10, color: Colors.textTertiary },

  deliveryInfo: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  deliveryTime: { fontSize: 10, color: Colors.textTertiary, fontWeight: '700' },
  stockInfo: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  stockText: { fontSize: 10, color: Colors.textTertiary, fontWeight: '700' },

  addBtn: { 
    borderWidth: 1.5, borderColor: Colors.success, borderRadius: Radii.sm, 
    paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#fff' 
  },
  addBtnText: { color: Colors.success, fontSize: 12, fontWeight: '900' },
  qtyStepper: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.success, 
    borderRadius: Radii.sm, gap: 10, paddingHorizontal: 8, paddingVertical: 4
  },
  stepperAction: { color: '#fff', fontSize: 16, fontWeight: '900' },
  qtyValue: { color: '#fff', fontSize: 13, fontWeight: '900' },

  // Toast
  toastContainer: { 
    position: 'absolute', bottom: 90, left: 16, right: 16, zIndex: 100 
  },
  toast: { 
    backgroundColor: '#fff', borderRadius: Radii.lg, padding: 12, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...Shadows.lg, borderWidth: 1, borderColor: '#eee'
  },
  toastLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  toastTitle: { fontSize: 14, fontWeight: '800', color: Colors.text },
  toastSubtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  toastSubtitle: { fontSize: 12, color: Colors.textTertiary, fontWeight: '600' },
  toastClose: { padding: 4 },

  // Cart Bar
  cartBar: { 
    position: 'absolute', 
    bottom: 30, // Elevated floating position
    left: 16, 
    right: 16, 
    backgroundColor: '#10B981', // Solid premium green
    borderRadius: Radii.md, 
    padding: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    ...Shadows.lg,
    zIndex: 1000,
  },
  cartBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  cartImgContainer: { 
    width: 40, height: 40, borderRadius: 8, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    padding: 4,
    justifyContent: 'center', alignItems: 'center'
  },
  cartImg: { width: '100%', height: '100%', resizeMode: 'contain' },
  cartBarTitle: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  cartBarSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '700' },
  cartBarRight: { 
    flexDirection: 'row', alignItems: 'center', gap: 4
  },
  viewCartText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
