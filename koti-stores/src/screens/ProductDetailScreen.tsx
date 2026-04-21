import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Star, ShoppingCart, Minus, Plus, Truck, RotateCcw, ShieldCheck, Leaf } from 'lucide-react-native';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { product }: { product: Product } = route.params;
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart.find((i) => i.id === product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        color={i < Math.floor(rating) ? '#f59e0b' : Colors.border}
        fill={i < Math.floor(rating) ? '#f59e0b' : 'transparent'}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Image ── */}
        <View style={styles.imageContainer}>

          {product.inStock === false && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>

        <View style={styles.content}>
          {/* ── Name + Rating ── */}
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.unit}>{product.unit}</Text>

          {product.rating !== undefined && (
            <View style={styles.ratingRow}>
              {renderStars(product.rating)}
              <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
              <Text style={styles.reviewText}>({product.reviewCount?.toLocaleString()} reviews)</Text>
            </View>
          )}

          {/* ── Price ── */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}

          </View>

          {/* ── Divider ── */}
          <View style={styles.divider} />

          {/* ── About ── */}
          <Text style={styles.sectionTitle}>About this product</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* ── Info chips ── */}
          <View style={styles.infoChips}>
            <View style={styles.infoChip}>
              <Truck size={24} color={Colors.primary} />
              <Text style={styles.infoChipLabel}>30–45 min{'\n'}delivery</Text>
            </View>
            <View style={styles.infoChip}>
              <RotateCcw size={24} color={Colors.primary} />
              <Text style={styles.infoChipLabel}>Easy{'\n'}returns</Text>
            </View>
            <View style={styles.infoChip}>
              <ShieldCheck size={24} color={Colors.primary} />
              <Text style={styles.infoChipLabel}>Quality{'\n'}assured</Text>
            </View>
            <View style={styles.infoChip}>
              <Leaf size={24} color={Colors.primary} />
              <Text style={styles.infoChipLabel}>Fresh{'\n'}produce</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Price</Text>
          <Text style={styles.footerPriceValue}>₹{product.price}</Text>
        </View>

        {product.inStock === false ? (
          <View style={styles.outOfStockBtn}>
            <Text style={styles.outOfStockBtnText}>Out of Stock</Text>
          </View>
        ) : cartItem ? (
          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => updateQuantity(product.id, cartItem.quantity - 1)}
              style={styles.qtyBtn}
            >
              <Minus size={20} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{cartItem.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(product.id, cartItem.quantity + 1)}
              style={styles.qtyBtn}
            >
              <Plus size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => addToCart(product)}
          >
            <ShoppingCart size={18} color={Colors.surface} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surfaceGray },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  iconBtn: { padding: Spacing.xs },
  headerTitle: {
    flex: 1,
    ...Typography.h3,
    marginHorizontal: Spacing.xs,
  },

  // Image
  imageContainer: {
    backgroundColor: Colors.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radii.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxs,
    zIndex: 10,
  },
  discountBadgeText: { color: Colors.surface, fontSize: 12, fontWeight: '700' },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  outOfStockText: { ...Typography.h2, color: Colors.textSecondary },

  // Content
  content: {
    backgroundColor: Colors.surface,
    marginTop: Spacing.xs,
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  name: { ...Typography.h2, marginBottom: Spacing.xxs },
  unit: { ...Typography.bodySm, marginBottom: Spacing.sm },

  // Rating
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  ratingText: { ...Typography.label, color: Colors.warning, marginLeft: 4 },
  reviewText: { ...Typography.caption },

  // Price
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  price: { fontSize: 26, fontWeight: '700', color: Colors.text },
  originalPrice: { fontSize: 16, color: Colors.textTertiary, textDecorationLine: 'line-through' },
  savingsBadge: { backgroundColor: Colors.successLight, borderRadius: Radii.xs, paddingHorizontal: Spacing.xs, paddingVertical: 2 },
  savingsText: { fontSize: 12, fontWeight: '700', color: Colors.success },

  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.md },

  // Description
  sectionTitle: { ...Typography.h3, marginBottom: Spacing.sm },
  description: { ...Typography.bodyLg, lineHeight: 24, color: Colors.textSecondary },

  // Info chips
  infoChips: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  infoChip: {
    flex: 1,
    backgroundColor: Colors.surfaceGray,
    borderRadius: Radii.sm,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  infoChipEmoji: { fontSize: 22, marginBottom: 6 },
  infoChipLabel: { ...Typography.caption, textAlign: 'center', lineHeight: 16 },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  footerPrice: {},
  footerPriceLabel: { ...Typography.caption },
  footerPriceValue: { ...Typography.h2 },

  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
  },
  addToCartText: { color: Colors.surface, fontSize: 16, fontWeight: '700' },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Radii.md,
    overflow: 'hidden',
  },
  qtyBtn: {
    padding: Spacing.sm,
    backgroundColor: Colors.primaryLight,
  },
  qtyText: {
    paddingHorizontal: Spacing.lg,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },

  outOfStockBtn: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
    backgroundColor: Colors.divider,
  },
  outOfStockBtnText: { ...Typography.label, color: Colors.textSecondary },
});
