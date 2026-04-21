import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Image, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Plus, Trash2, Tag, ShoppingBag, X, ChevronRight, Zap, Gift } from 'lucide-react-native';
import { useCart } from '../CartContext';
import { t } from '../i18n/strings';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

export default function CartScreen({ navigation }: any) {
  const {
    cart, updateQuantity, removeFromCart, totalItems,
    subtotal, couponDiscount, couponCode, applyCoupon, removeCoupon,
    serviceFee, grandTotal,
    activeAddress, currentTier, nextTier,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    const err = applyCoupon(couponInput);
    if (err) { setCouponError(err); }
    else { setCouponError(''); setCouponInput(''); }
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <ShoppingBag size={80} color={Colors.border} />
        <Text style={styles.emptyTitle}>{t('emptyCart')}</Text>
        <Text style={styles.emptySubtitle}>Add items to get started</Text>
        <TouchableOpacity 
          style={styles.shopBtn} 
          onPress={() => navigation.navigate('Home')}
          accessibilityLabel={t('shopNow')}
          accessibilityRole="button"
        >
          <Text style={styles.shopBtnText}>{t('shopNow')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <ShoppingBag size={22} color={Colors.text} />
        <Text style={styles.headerTitle}>{t('myCart')}</Text>
        <Text style={styles.headerCount}>{totalItems} {totalItems === 1 ? t('item') : t('items')}</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          /* Delivery address row */
          <TouchableOpacity
            style={styles.addressBar}
            onPress={() => navigation.navigate('AddressList')}
            accessibilityLabel={`${t('deliveringTo')} ${activeAddress.label}`}
            accessibilityRole="button"
          >
            <View style={styles.addressBarLeft}>
              <Text style={styles.addressBarLabel}>{t('deliveringTo')}</Text>
              <Text style={styles.addressBarValue} numberOfLines={1}>
                {activeAddress.label}: {activeAddress.line1}
              </Text>
            </View>
            <ChevronRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        }
        renderItem={({ item }) => (
          <View style={styles.cartItem} accessibilityLabel={`${item.name}, ₹${item.price}`}>
            <Image source={{ uri: item.image }} style={styles.itemImage} accessibilityElementsHidden={true} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemUnit}>{item.unit}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
            <View style={styles.itemRight}>
              <TouchableOpacity 
                onPress={() => removeFromCart(item.id)} 
                style={styles.deleteBtn}
                accessibilityLabel={`Remove ${item.name}`}
                accessibilityRole="button"
              >
                <Trash2 size={14} color={Colors.error} />
              </TouchableOpacity>
              <View style={styles.qtyControls}>
                <TouchableOpacity 
                  onPress={() => updateQuantity(item.id, item.quantity - 1)} 
                  style={styles.qtyBtn}
                  accessibilityLabel="Decrease quantity"
                >
                  <Minus size={14} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.qtyText} accessibilityLabel={`Quantity ${item.quantity}`}>{item.quantity}</Text>
                <TouchableOpacity 
                  onPress={() => updateQuantity(item.id, item.quantity + 1)} 
                  style={styles.qtyBtn}
                  accessibilityLabel="Increase quantity"
                >
                  <Plus size={14} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            {/* Next Tier Nudge */}
            {nextTier && (
              <TouchableOpacity 
                style={styles.nextTierBanner}
                onPress={() => navigation.navigate('Home')}
              >
                <Zap size={18} color="#92400E" />
                <Text style={styles.nextTierText}>
                  Add <Text style={{ fontWeight: '900' }}>₹{nextTier.amount}</Text> more to get <Text style={{ fontWeight: '900' }}>{nextTier.discount} OFF</Text> ({nextTier.name} Tier)
                </Text>
                <ChevronRight size={16} color="#92400E" />
              </TouchableOpacity>
            )}

            {/* Coupon Section */}
            <View style={styles.couponSection}>
              {currentTier !== 'none' && !couponCode && (
                <TouchableOpacity 
                  style={styles.autoApplyBox}
                  onPress={() => setCouponInput(currentTier.toUpperCase() + (currentTier === 'gold' ? '25' : currentTier === 'silver' ? '30' : '35'))}
                >
                  <Gift size={16} color={Colors.primary} />
                  <Text style={styles.autoApplyText}>
                    You've reached <Text style={{ fontWeight: '800' }}>{currentTier.toUpperCase()}</Text>! Click to add coupon.
                  </Text>
                  <View style={styles.addCouponBtnSmall}>
                    <Text style={styles.addCouponBtnTextSmall}>Add Coupon</Text>
                  </View>
                </TouchableOpacity>
              )}

              {couponCode ? (
                <View style={styles.couponApplied}>
                  <Tag size={20} color={Colors.success} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.couponAppliedText}>Code {couponCode} applied!</Text>
                    <Text style={styles.couponHint}>Savings: ₹{couponDiscount}</Text>
                  </View>
                  <TouchableOpacity onPress={removeCoupon}>
                    <X size={20} color={Colors.textTertiary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.couponRow}>
                    <Tag size={20} color={Colors.primary} />
                    <TextInput
                      style={styles.couponInput}
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChangeText={setCouponInput}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity 
                      style={styles.applyBtn}
                      onPress={handleApplyCoupon}
                    >
                      <Text style={styles.applyBtnText}>APPLY</Text>
                    </TouchableOpacity>
                  </View>
                  {couponError ? <Text style={styles.couponError}>{couponError}</Text> : null}
                </>
              )}
            </View>

            <View style={styles.bill}>
              <Text style={styles.billTitle}>{t('billDetails')}</Text>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>{t('subtotal')}</Text>
                <Text style={styles.billValue}>₹{subtotal}</Text>
              </View>

              {couponDiscount > 0 && (
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Discount</Text>
                  <Text style={[styles.billValue, styles.green]}>-₹{couponDiscount}</Text>
                </View>
              )}

              <View style={styles.billRow}>
                <View>
                   <Text style={styles.billLabel}>Delivery & Handling Fees</Text>
                   <Text style={styles.feeBreakdown}>Inc. Platform Fee</Text>
                </View>
                <Text style={styles.billValue}>₹{serviceFee}</Text>
              </View>

              <View style={[styles.billRow, styles.totalRow]}>
                <View>
                   <Text style={styles.totalLabel}>{t('grandTotal')}</Text>
                   <Text style={styles.gstNote}>GST included in product price</Text>
                </View>
                <Text style={styles.totalValue}>₹{grandTotal}</Text>
              </View>
            </View>
          </View>
        }
      />

      {/* Checkout CTA */}
      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutTotal}>₹{grandTotal}</Text>
          <Text style={styles.checkoutNote}>Total incl. all charges</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
          accessibilityLabel={t('checkout')}
          accessibilityRole="button"
        >
          <Text style={styles.checkoutBtnText}>{t('checkout')}</Text>
          <ChevronRight size={18} color={Colors.surface} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surfaceGray },

  // Empty
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl, backgroundColor: Colors.surface },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.md },
  emptyTitle: { ...Typography.h2, marginBottom: Spacing.xs },
  emptySubtitle: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.lg },
  shopBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, borderRadius: Radii.full },
  shopBtnText: { color: Colors.surface, fontWeight: '700', fontSize: 16 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.surface, padding: Spacing.md,
    borderBottomWidth: 1, borderColor: Colors.border,
  },
  headerTitle: { flex: 1, ...Typography.h2 },
  headerCount: { ...Typography.bodySm, color: Colors.textSecondary },

  list: { padding: Spacing.md, paddingBottom: 100 },

  // Address bar
  addressBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primaryLight, borderRadius: Radii.md,
    padding: Spacing.sm, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.primary + '40',
  },
  addressBarLeft: { flex: 1 },
  addressBarLabel: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
  addressBarValue: { ...Typography.body, color: Colors.text, marginTop: 2 },

  // Cart items
  cartItem: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: Radii.md, padding: Spacing.sm,
    marginBottom: Spacing.sm, alignItems: 'center', ...Shadows.sm,
  },
  itemImage: { width: 72, height: 72, borderRadius: Radii.sm, resizeMode: 'contain', backgroundColor: Colors.surfaceGray },
  itemInfo: { flex: 1, paddingHorizontal: Spacing.sm },
  itemName: { ...Typography.label, fontSize: 13, marginBottom: 2 },
  itemUnit: { ...Typography.caption, marginBottom: 4 },
  itemPrice: { ...Typography.bodySm, color: Colors.textSecondary },
  itemRight: { alignItems: 'flex-end', gap: Spacing.xs },
  deleteBtn: { padding: Spacing.xxs },
  qtyControls: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.primary, borderRadius: Radii.xs },
  qtyBtn: { padding: 6 },
  qtyText: { paddingHorizontal: Spacing.xs, fontWeight: '700', fontSize: 13, color: Colors.text },
  itemTotal: { ...Typography.label, color: Colors.text },

  // Footer sections
  footer: { gap: Spacing.sm },

  nextTierBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    gap: 12,
    ...Shadows.sm,
  },
  nextTierText: { flex: 1, fontSize: 13, color: '#92400E', fontWeight: '600' },

  couponSection: { backgroundColor: Colors.surface, borderRadius: Radii.md, padding: Spacing.md, ...Shadows.sm },
  autoApplyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: 10,
    borderRadius: Radii.sm,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '22',
  },
  autoApplyText: { flex: 1, fontSize: 12, color: Colors.primary, fontWeight: '600' },
  addCouponBtnSmall: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addCouponBtnTextSmall: { color: '#fff', fontSize: 10, fontWeight: '800' },

  couponRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  couponInput: { flex: 1, ...Typography.body, color: Colors.text, padding: Spacing.xs },
  applyBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 6, backgroundColor: Colors.primary, borderRadius: Radii.sm },
  applyBtnText: { color: Colors.surface, fontWeight: '800', fontSize: 12 },
  couponError: { ...Typography.caption, color: Colors.error, marginTop: 4 },
  couponHint: { ...Typography.caption, color: Colors.textTertiary, marginTop: 4 },
  couponApplied: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  couponAppliedText: { flex: 1, ...Typography.body, color: Colors.success },

  bill: { backgroundColor: Colors.surface, borderRadius: Radii.md, padding: Spacing.md, ...Shadows.sm },
  billTitle: { ...Typography.h3, marginBottom: Spacing.sm },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  billLabel: { ...Typography.body, color: Colors.textSecondary },
  billValue: { ...Typography.body, color: Colors.text },
  green: { color: Colors.success, fontWeight: '700' },
  totalRow: { borderTopWidth: 1, borderColor: Colors.divider, marginTop: 6, paddingTop: 10 },
  totalLabel: { ...Typography.h3 },
  totalValue: { ...Typography.h3, color: Colors.primary },
  feeBreakdown: { fontSize: 10, color: Colors.textTertiary, marginTop: 2 },
  gstNote: { fontSize: 10, color: Colors.success, marginTop: 2, fontWeight: '600' },
  freeDeliveryHint: { ...Typography.caption, color: Colors.primary, marginTop: 4, textAlign: 'center' },

  // Checkout bar
  checkoutBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.md, backgroundColor: Colors.surface,
    borderTopWidth: 1, borderColor: Colors.border, ...Shadows.lg,
  },
  checkoutTotal: { ...Typography.h2 },
  checkoutNote: { ...Typography.caption },
  checkoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary, paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md, borderRadius: Radii.lg,
  },
  checkoutBtnText: { color: Colors.surface, fontWeight: '700', fontSize: 15 },
});
