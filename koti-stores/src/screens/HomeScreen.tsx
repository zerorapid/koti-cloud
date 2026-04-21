import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MapPin, Search, Zap, ChevronRight, ChevronDown, Crown, Plus,
  Apple, Milk, Coffee, Cookie, Drumstick, Croissant, 
  Wheat, Eraser, Bath, Snowflake 
} from 'lucide-react-native';
import { useCart } from '../CartContext';
import { BANNERS, CATEGORIES, BESTSELLERS, ON_OFFER, FRESH_TODAY } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { Skeleton, BannerSkeleton, CategorySkeleton, ProductSkeleton } from '../components/Skeleton';
import { t } from '../i18n/strings';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

const CATEGORY_ICONS: Record<string, any> = {
  fruits: Apple,
  dairy: Milk,
  beverages: Coffee,
  snacks: Cookie,
  meat: Drumstick,
  bakery: Croissant,
  staples: Wheat,
  household: Eraser,
  personal: Bath,
  frozen: Snowflake,
};

function CategoryIcon({ id, size = 24, color = Colors.primary }: { id: string; size?: number; color?: string }) {
  const Icon = CATEGORY_ICONS[id] || Apple;
  return <Icon size={size} color={color} />;
}

const { width: SCREEN_W } = Dimensions.get('window');
const BANNER_W = SCREEN_W - 32;

const ProductSection = ({ title, data, navigation, onSeeAll }: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAllText}>{t('seeAll')}</Text>
      </TouchableOpacity>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.productScroll}
    >
      {data.map((item: any) => (
        <View key={item.id} style={{ width: 160 }}>
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          />
        </View>
      ))}
    </ScrollView>
  </View>
);

import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function HomeScreen({ navigation }: any) {
  const { activeAddress, totalItems, currentTier } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // REAL-TIME CLOUD SYNC: Listens for changes in the 'products' collection
    const q = query(collection(db, 'products'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
      setIsLoading(false);
    }, (error) => {
      console.log("Firebase Sync Error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = React.useCallback(() => {
    // No-op for Firebase as it's real-time, but we can reset loading for UX
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Sections
  const bestSellers = products.slice(0, 4);
  const onOffer = products.filter(p => p.labels?.includes('Sync Testing') || p.labels?.includes('New Arrival'));
  const freshToday = products.filter(p => p.category === 'fruits' || p.category === 'dairy');

  const TIER_COLORS = {
    none: Colors.textSecondary,
    gold: Colors.gold,
    platinum: Colors.platinumDark,
    diamond: Colors.violet,
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
           <View style={{ flex: 1 }}>
              <Skeleton width="40%" height={12} style={{ marginBottom: 8 }} />
              <Skeleton width="60%" height={16} />
           </View>
           <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 16 }}>
            <BannerSkeleton />
          </View>
          <View style={{ marginTop: 8 }}>
            <CategorySkeleton />
          </View>
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <Skeleton width="50%" height={22} style={{ marginBottom: 16 }} />
            <View style={{ flexDirection: 'row' }}>
               <ProductSkeleton />
               <ProductSkeleton />
            </View>
          </View>
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <Skeleton width="100%" height={60} borderRadius={Radii.md} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <View style={styles.addressBlock}>
          <Text style={styles.deliverLabel}>{t('deliveringTo')}</Text>
          <TouchableOpacity
            style={styles.addressRow}
            onPress={() => navigation.navigate('Profile', { screen: 'AddressList' })}
            accessibilityLabel={`${t('deliveringTo')} ${activeAddress.line1}`}
            accessibilityRole="button"
          >
            <MapPin size={18} color={Colors.primary} />
            <Text style={styles.addressText} numberOfLines={1}>{activeAddress.label}: {activeAddress.line1}</Text>
            <ChevronDown size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[
            styles.membershipBtn, 
            { borderColor: TIER_COLORS[currentTier] + '66' },
            currentTier === 'diamond' && { backgroundColor: Colors.violetLight }
          ]}
          onPress={() => navigation.navigate('MembershipTiers')}
        >
          <Crown size={20} color={TIER_COLORS[currentTier]} />
          {currentTier !== 'none' && (
            <View style={[styles.tierBadge, { backgroundColor: TIER_COLORS[currentTier] }]} />
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.profileBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.avatarMini}>
             <Text style={styles.avatarMiniText}>J</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Floating Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.floatingSearch}
          onPress={() => navigation.navigate('Search')}
          accessibilityLabel={t('searchPlaceholder')}
          accessibilityRole="search"
        >
          <Search size={20} color={Colors.primary} />
          <Text style={styles.searchPlaceholderText}>{t('searchPlaceholder')}</Text>
          <View style={styles.searchDivider} />
          <Zap size={18} color="#FFD700" fill="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        bounces
        refreshControl={
          <RefreshControl 
            refreshing={false} 
            onRefresh={onRefresh} 
            tintColor={Colors.primary} 
            colors={[Colors.primary]}
          />
        }
      >
        {/* ── Banner Carousel ── */}
        <View style={styles.bannerContainer}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            snapToInterval={BANNER_W + Spacing.sm}
            decelerationRate="fast"
            contentContainerStyle={styles.bannerScroll}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / (BANNER_W + Spacing.sm));
              setActiveBanner(idx);
            }}
          >
            {BANNERS.map((banner) => (
              <TouchableOpacity
                key={banner.id}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('CategoryProducts', { categoryId: banner.categoryId, categoryName: banner.categoryName })}
                accessibilityLabel={`${banner.title}. ${banner.subtitle}`}
                accessibilityRole="imagebutton"
              >
                <View style={[styles.banner, { backgroundColor: banner.bg }]}>
                  <View style={styles.bannerText}>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                  </View>
                  <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Dots */}
          <View style={styles.dots} accessibilityElementsHidden={true}>
            {BANNERS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeBanner && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* ── Category Chips ── */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryChip}
                onPress={() => navigation.navigate('CategoryProducts', { categoryId: cat.id, categoryName: cat.name })}
                accessibilityLabel={cat.name}
                accessibilityRole="button"
              >
                <CategoryIcon id={cat.id} />
                <Text style={styles.categoryChipName} numberOfLines={1}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.categoryChip, { backgroundColor: Colors.primaryLight }]}
              onPress={() => navigation.navigate('Categories')}
              accessibilityLabel={t('seeAll')}
              accessibilityRole="button"
            >
              <Plus size={24} color={Colors.primary} />
              <Text style={[styles.categoryChipName, { color: Colors.primary, fontWeight: '700' }]}>{t('seeAll')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* ── Product Sections ── */}
        <ProductSection
          title={t('bestsellers')}
          data={bestSellers}
          navigation={navigation}
          onSeeAll={() => navigation.navigate('Categories')}
        />

        {/* ── Offer Banner ── */}
        <View style={styles.offerBanner} accessibilityLabel={t('offerBanner')}>
          <Text style={styles.offerBannerText}>{t('offerBanner')}</Text>
        </View>

        <ProductSection
          title={t('onOffer')}
          data={onOffer}
          navigation={navigation}
          onSeeAll={() => navigation.navigate('Categories')}
        />

        <ProductSection
          title={t('freshToday')}
          data={freshToday}
          navigation={navigation}
          onSeeAll={() => navigation.navigate('Categories')}
        />

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  addressBlock: { flex: 1, marginRight: 12 },
  deliverLabel: { fontSize: 11, fontWeight: '700', color: Colors.primary, textTransform: 'uppercase', marginBottom: 2 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addressText: { fontSize: 16, fontWeight: '800', color: Colors.text, maxWidth: '90%' },
  
  profileBtn: { marginLeft: 8 },
  membershipBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5,
    ...Shadows.sm,
    marginRight: 4,
  },
  tierBadge: {
    position: 'absolute', top: -2, right: -2,
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 2, borderColor: '#fff'
  },
  avatarMini: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.primary + '22'
  },
  avatarMiniText: { color: Colors.primary, fontWeight: '800', fontSize: 16 },

  searchContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  floatingSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: Radii.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.gold + '33',
    ...Shadows.sm,
  },
  searchPlaceholderText: { flex: 1, fontSize: 14, color: Colors.textTertiary, fontWeight: '600' },
  searchDivider: { width: 1, height: 20, backgroundColor: '#D1D5DB' },

  bannerContainer: { marginTop: 8, marginBottom: 24 },
  bannerScroll: { paddingHorizontal: 16 },
  banner: { 
    width: BANNER_W, 
    height: BANNER_W * 0.45, 
    borderRadius: Radii.lg, 
    marginRight: Spacing.sm, 
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.md,
  },
  bannerText: { flex: 1, zIndex: 10 },
  bannerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 4 },
  bannerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  bannerImage: { width: 140, height: '100%', resizeMode: 'cover', position: 'absolute', right: 0 },
  
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E5E7EB' },
  dotActive: { width: 18, backgroundColor: Colors.primary },

  section: { marginBottom: 32 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    paddingHorizontal: 16, 
    marginBottom: 16 
  },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1A1C1E', letterSpacing: -0.5 },
  seeAllText: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  
  productScroll: { paddingHorizontal: 12 },

  categoriesContainer: { marginBottom: 32, marginTop: 8 },
  categoriesScroll: { paddingHorizontal: 16, gap: 16, paddingBottom: 8 },
  categoryChip: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: Radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minWidth: 90,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  categoryChipIcon: { fontSize: 28, marginBottom: 6 },
  categoryChipName: { fontSize: 11, fontWeight: '700', color: '#4B5563', textAlign: 'center' },

  offerBanner: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: '#FFFBEB',
    borderRadius: Radii.md,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  offerBannerText: { flex: 1, fontSize: 14, color: '#92400E', fontWeight: '700' },
});
