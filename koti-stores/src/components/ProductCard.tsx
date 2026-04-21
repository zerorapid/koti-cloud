import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Plus, Minus, Star } from 'lucide-react-native';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { useToast } from './Toast';
import { Colors, Spacing, Radii, Typography, Shadows } from '../theme';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  const { showToast } = useToast();
  const cartItem = cart.find((item) => item.id === product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, product.inStock === false && styles.cardDisabled]}
        onPress={() => { handlePress(); onPress?.(); }}
        activeOpacity={0.85}
      >
        {/* Product image */}
        <Image
          source={{ uri: product.image }}
          style={[styles.image, product.inStock === false && styles.imageDisabled]}
        />

        {/* Out of stock overlay */}
        {product.inStock === false && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of stock</Text>
          </View>
        )}

        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.unit}>{product.unit}</Text>

          {/* Rating */}
          {product.rating !== undefined && (
            <View style={styles.ratingRow}>
              <Star size={11} color={Colors.warning} fill={Colors.warning} />
              <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            </View>
          )}

          {/* Price + Add */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.price}>₹{product.price}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
              )}
            </View>

            {product.inStock === false ? (
              <View style={styles.outOfStockBtn} />
            ) : cartItem ? (
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={() => { handlePress(); updateQuantity(product.id, cartItem.quantity - 1); }}
                  style={styles.quantityButton}
                  accessibilityLabel="Decrease quantity"
                >
                  <Minus size={14} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.quantityText} accessibilityLabel={`Quantity ${cartItem.quantity}`}>{cartItem.quantity}</Text>
                <TouchableOpacity
                  onPress={() => { handlePress(); updateQuantity(product.id, cartItem.quantity + 1); }}
                  style={styles.quantityButton}
                  accessibilityLabel="Increase quantity"
                >
                  <Plus size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => { handlePress(); addToCart(product); showToast(`Added ${product.name} to cart`); }}
                style={styles.addButton}
                accessibilityLabel={`Add ${product.name} to cart`}
              >
                <Text style={styles.addButtonText}>ADD</Text>
                <Plus size={14} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F9FA', // Soft Swiggy-style background
    borderRadius: Radii.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.xxs + 1,
    flex: 1,
    ...Shadows.premium,
    borderWidth: 0, // No borders
  },
  cardDisabled: { opacity: 0.6 },

  image: {
    width: '100%',
    height: 120,
    borderRadius: Radii.md,
    resizeMode: 'contain',
    backgroundColor: '#fff', // White box for image
    marginBottom: Spacing.sm,
  },
  imageDisabled: { opacity: 0.4 },

  outOfStockBadge: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingVertical: 6,
    alignItems: 'center',
    zIndex: 20,
  },
  outOfStockText: { color: Colors.textSecondary, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

  details: { flex: 1, paddingTop: 4 },
  name: { 
    ...Typography.label, 
    fontSize: 14, 
    marginBottom: 4, 
    lineHeight: 18,
    color: '#1A1C1E',
    fontWeight: '700'
  },
  unit: { 
    ...Typography.caption, 
    color: '#5E6166',
    marginBottom: 8 
  },

  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 8 },
  ratingText: { fontSize: 11, fontWeight: '800', color: '#1A1C1E' },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: { fontSize: 16, fontWeight: '800', color: '#1A1C1E' },
  originalPrice: {
    fontSize: 11,
    color: Colors.textTertiary,
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },

  addButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E2E6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Radii.sm,
    ...Shadows.sm,
  },
  addButtonText: { color: Colors.primary, fontWeight: '800', fontSize: 13 },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radii.sm,
    paddingHorizontal: 4,
    height: 36, // Match ADD button height
    ...Shadows.sm,
  },
  quantityButton: { padding: 8 },
  quantityText: {
    paddingHorizontal: 6,
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
  },

  outOfStockBtn: { width: 60 },
});
